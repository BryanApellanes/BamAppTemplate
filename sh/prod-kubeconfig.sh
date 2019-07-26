
export AWS_PROFILE=prod
export KUBECONFIG=/Users/bapellanes/config/prod/kubeconfig
export PS1="\\[\\033[36m\\]\\u\\[\\033[m\\]@\\[\\033[32m\\]\\h:\\[\\033[33;1m\\]\\w\\[\\033[m\\] PRODAWS $ "

echo -n -e "\033]6;1;bg;red;brightness;270\a"
echo -n -e "\033]6;1;bg;green;brightness;60\a"
echo -n -e "\033]6;1;bg;blue;brightness;83\a"

bash

echo -e "\033]6;1;bg;*;default\a"
