# Situation: the wordpress:* images have an entrypoint script that:
# 1. Checks what CMD is being run. If it starts with apache2, then it downloads the WordPress distribution.
# 2. Runs the CMD normally.
# We want to copy some Wiris files into the distribution.
# Unfortunately, if we use straight up volumes, these files can be overwritten by the entrypoint.
# We need to copy files AFTER the WordPress distribution has been downloaded but also run the origina CMD, apache2-foreground.
# This solution creates a wrapper called apache2-foreground-custom, which given its name triggers the download of WordPress,
# but internally first copies the Wiris files and then runs the actual apache2-foreground.

FROM wordpress:php8.0-apache

# Copy the faux apache2-foreground into the image
COPY apache2-foreground-custom /bin/apache2-foreground-custom

# Tell docker to run apache2-foreground-custom instead of apache2-foreground
CMD ["apache2-foreground-custom"]
