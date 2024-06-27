FROM tomcat:9.0-alpine

ADD sample.war /usr/local/tomcat/webapps/
COPY frontend/build /usr/local/tomcat/webapps/frontend
COPY context.xml /usr/local/tomcat/conf/context.xml
COPY rewrite.config /usr/local/tomcat/webapps/ROOT/WEB-INF/rewrite.config

EXPOSE 8080
CMD ["catalina.sh", "run"]