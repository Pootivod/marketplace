{{- define "marketplace.service.tpl" -}}
apiVersion: v1
kind: Service
metadata:
  name: {{ include "marketplace.serviceName" (dict "name" .name "service" .service) }}
  namespace: {{ .root.Values.global.namespace.name }}
  labels:
    {{- include "marketplace.labels" .root | nindent 4 }}
    app.kubernetes.io/name: {{ .name }}
{{- with .service.labels }}
{{ toYaml . | nindent 4 }}
{{- end }}
spec:
  type: {{ .service.service.type | default "ClusterIP" }}
  selector:
    app.kubernetes.io/name: {{ .name }}
  ports:
    - name: http
      port: {{ .service.service.port | default .service.containerPort | default 8080 }}
      targetPort: {{ .service.service.targetPort | default .service.containerPort | default 8080 }}
{{- end -}}
