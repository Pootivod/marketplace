import jenkins.model.Jenkins
import hudson.init.InitMilestone
import hudson.init.Initializer
import javaposse.jobdsl.plugin.ExecuteDslScripts

@Initializer(after = InitMilestone.COMPLETED)
def setupAndRun() {
    def generated = new ExecuteDslScripts().runScript("""
        pipelineJob('MyImmediateJob') {
            definition {
                cps {
                    script(new File('/var/jenkins_home/workspace/buildPipeline/Jenkinsfile').text)
                    sandbox()
                }
            }
        }
    """)

    generated.jobs.each {
        Jenkins.get().getItemByFullName(it.jobName).scheduleBuild2(0)
    }
}
