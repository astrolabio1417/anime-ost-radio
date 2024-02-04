# ----------------------------------------------------------------------
# | Config file for music.animeyubi.com host                                   |
# ----------------------------------------------------------------------
#
# This file is a template for an Nginx server.
# This Nginx server listens for the `music.animeyubi.com` host and handles requests.
# Replace `music.animeyubi.com` with your hostname before enabling.

# Choose between www and non-www, listen on the wrong one and redirect to
# the right one.
# https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/#server-name-if
server {
  listen [::]:443 ssl http2;
  listen 443 ssl http2;

  server_name www.music.animeyubi.com;

  include h5bp/tls/ssl_engine.conf;
  include h5bp/tls/certificate_files.conf;
  include h5bp/tls/policy_balanced.conf;

  return 301 $scheme://music.animeyubi.com$request_uri;
}


server {
  # listen [::]:443 ssl http2 accept_filter=dataready;  # for FreeBSD
  # listen 443 ssl http2 accept_filter=dataready;  # for FreeBSD
  listen [::]:443 ssl http2;
  listen 443 ssl http2;

  # The host name to respond to
  server_name music.animeyubi.com;

  include h5bp/tls/ssl_engine.conf;
  include h5bp/tls/certificate_files.conf;
  include h5bp/tls/policy_balanced.conf;

  # Path for static files
  root /var/www/music.animeyubi.com/public;

  # Custom error pages
  include h5bp/errors/custom_errors.conf;

  # Include the basic h5bp config set
  include h5bp/basic.conf;
}
