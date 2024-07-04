service_env="dev";
type="restart";
command="";

while [ : ]
do
    case "${1}" in
        -e|--env) service_env=$2
            shift 2
            ;;
        -c|--command) type=$2
            shift 2
            ;;
        --)
            break
            ;;
        *)
            break
            ;;
    esac
done

case $type in
    (restart)
        command="docker restart docker-services-$service_env";
        ;;
    (start)
        command="docker compose -f docker-services.yml \
        --env-file ../env/$service_env.env -p docker-services-$service_env --ansi never up --force-recreate  -d --build"
        type="start";
        ;;
    (*)
                echo "Invalid option: -c --command" >&2
                exit 1
        ;;
esac

eval "$command";