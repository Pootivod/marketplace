// Used in cloud and locally (local-build/). TODO: env build params, parallel build - java python web
pipeline {
agent none
    stages {
        // Ref to name in local-build/ (workspace path)
        stage('Build') {
            agent {
                docker {
                    image 'maven:3.9.6-eclipse-temurin-21'
                    args '-v m2-cache:/root/.m2'
                }
            }
            steps {
                dir('backend/java') {
                    sh "mvn clean package jib:buildTar -DskipTests"
                }
            }
        }
        stage('Load java to docker registry') {
            agent any
            steps {
                dir ('backend/java') {
                    script {
                        def registry = "localhost:5000"
                        def files = findFiles(glob: "target/images/*.tar")

                        files.each { file ->
                            def imageName = file.name.take(file.name.lastIndexOf("."))
                            def manifest = readJSON(text: sh(script: "tar -xOf ${file.path} manifest.json", returnStdout: true).trim())
                            def tags = manifest[0].RepoTags
                            // tag - name:version
                            tags.each { tag ->
                            def target = "docker://${registry}/${tag}"
                            sh "skopeo copy --dest-tls-verify=false docker-archive:${file.path} ${target}"
                            }

                        }
                    }
                }
            }
        }
    }
}
