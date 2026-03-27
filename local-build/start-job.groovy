import jenkins.model.Jenkins
import javaposse.jobdsl.dsl.DslScriptLoader
import javaposse.jobdsl.plugin.JenkinsJobManagement

def jm = new JenkinsJobManagement(System.out, System.getenv(), new File('.'))

def dsl = """
    pipelineJob('buildPipeline') {
        configure { it / 'customWorkspace' << '/var/jenkins_home/workspace/buildPipeline' }
        definition {
            cps {
                script(new File('/var/jenkins_home/workspace/buildPipeline/Jenkinsfile').text)
                sandbox()
            }
        }
    }
"""

new DslScriptLoader(jm).runScript(dsl)
Jenkins.instance.getItem('buildPipeline').scheduleBuild2(0)
