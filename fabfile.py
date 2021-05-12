import time
from fabric import task, SerialGroup as Group
from fabric.connection import Connection


@task
def production(c):
    c.config["hosts"] = ["chat@kiora.cloudez.io:22122"]
    c.config["user"] = "chat"
    c.config["app_name"] = "chat.cloudez.io"
    c.config["deploy_path"] = f"/srv/{c.config.app_name}/www"
    c.config["current_path"] = f"/srv/{c.config.app_name}/www/current"
    c.config["releases_path"] = f"/srv/{c.config.app_name}/www/releases"
    c.config["releases_limit"] = 3
    c.config["shared_path"] = f"/srv/{c.config.app_name}/www/shared"
    c.config["shared_files"] = ["/.env"]
    c.config["git_origin"] = "gitea@gitea.cloudez.io:cloudez/cloudez-chat.git"
    c.config["git_branch"] = "main"


@task
def deploy(c):
    pool = Group(*c.config.hosts)
    setup(pool, c)
    checkout(pool, c)
    releases(pool, c)
    symlink(pool, c)
    cleanup(pool, c)


## Helpers functions


def setup(pool, c):
    pool.run("mkdir -p {}".format(c.config.deploy_path))
    pool.run("mkdir -p {}/releases".format(c.config.deploy_path))
    pool.run("mkdir -p {}/shared".format(c.config.deploy_path))


def checkout(pool, c):
    c.config.current_release = f"{c.config.releases_path}/{time.time():.0f}"
    pool.run(
        f"git clone -q -b {c.config.git_branch} -o deploy --depth 1 {c.config.git_origin} {c.config.current_release}"
    )
    shared(pool, c)
    pool.run(f"cd {c.config.current_release}; yarn; yarn build;", shell=False)


def shared(pool, c):
    if c.config.shared_files:
        command = "ln -nfs {0}{1} {2}{1}"
        for shared_file in c.config.shared_files:
            pool.run(
                command.format(
                    c.config.shared_path, shared_file, c.config.current_release
                )
            )


def releases(pool, c):
    c.config.releases = pool.run(f"ls -x {c.config.releases_path}")


def symlink(pool, c):
    pool.run(f"ln -nfs {c.config.current_release} {c.config.current_path}")


def cleanup(pool, c):
    for p in pool:
        releases = c.config.releases[p].stdout.split()

        if len(releases) > c.config.releases_limit:
            directories = releases
            directories.reverse()
            del directories[: c.config.releases_limit]
            c.config.directories = " ".join(
                [
                    "{0}/{1}".format(c.config.releases_path, release)
                    for release in directories
                ]
            )
            p.run("rm -rf {}".format(c.config.directories))


## end helpers functions
