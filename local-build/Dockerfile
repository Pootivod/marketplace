FROM jenkins/jenkins:lts-jdk21
USER root
RUN apt-get update && apt-get install -y docker.io skopeo
COPY start-job.groovy /usr/share/jenkins/ref/init.groovy.d/
RUN jenkins-plugin-cli --plugins \
    configuration-as-code \
    pipeline-utility-steps \
    job-dsl \
    workflow-aggregator
