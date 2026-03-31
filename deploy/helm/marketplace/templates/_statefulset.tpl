{{- define "marketplace.statefulset" -}}
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: {{ .name }}
  namespace: {{ .root.Values.namespace.name }}
  labels:
    {{- include "marketplace.labels" (dict "root" .root "app" .name) | nindent 4 }}
spec:
  serviceName: {{ .serviceName }}
  replicas: {{ .replicas }}
  selector:
    matchLabels:
      app: {{ .name }}
  template:
    metadata:
      labels:
        app: {{ .name }}
    spec:
      containers:
        - name: {{ .name }}
          image: {{ .image }}
          {{- with .ports }}
          ports:
            {{- toYaml . | nindent 12 }}
          {{- end }}
          {{- with .env }}
          env:
            {{- toYaml . | nindent 12 }}
          {{- end }}
          {{- with .volumeMounts }}
          volumeMounts:
            {{- toYaml . | nindent 12 }}
          {{- end }}
      {{- with .volumes }}
      volumes:
        {{- toYaml . | nindent 8 }}
      {{- end }}
  {{- with .volumeClaimTemplates }}
  volumeClaimTemplates:
    {{- toYaml . | nindent 4 }}
  {{- end }}
{{- end -}}
