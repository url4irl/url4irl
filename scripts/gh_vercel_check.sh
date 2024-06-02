echo "Is your GitHub account linked to Vercel?"
# Prompt user with y/n
read -p "y/n: " yn
case $yn in
    [Yy]* ) echo "Good!";;
    [Nn]* ) echo "Please link your GitHub account to Vercel"; exit 1;;
    * ) echo "Please answer y/n"; exit 1;;
esac