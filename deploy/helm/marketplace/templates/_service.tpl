{{- define "marketplace.service" -}}
apiVersion: v1
kind: Service
metadata:
  name: {{ .name }}
  namespace: {{ .root.Values.namespace.name }}
  labels:
    {{- include "marketplace.labels" (dict "root" .root "app" .name) | nindent 4 }}
    {{- with .labels }}
    {{- toYaml . | nindent 4 }}
    {{- end }}
spec:
  type: {{ default "ClusterIP" .type }}
  ports:
    - name: {{ default "http" .portName }}
      port: {{ default 80 .port }}
      targetPort: {{ default 8080 .targetPort }}
    - name: management
      port: 9000
      targetPort: 9000
  selector:
    app: {{ .name }}
{{- end -}}
