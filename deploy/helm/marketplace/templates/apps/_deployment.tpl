{{- define "marketplace.deployment.tpl" -}}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .name }}
  namespace: {{ .root.Values.global.namespace.name }}
  labels:
    {{- include "marketplace.labels" .root | nindent 4 }}
    app.kubernetes.io/name: {{ .name }}
spec:
  replicas: {{ .service.replicas | default 1 }}
  selector:
    matchLabels:
      app.kubernetes.io/name: {{ .name }}
  template:
    metadata:
      labels:
        app.kubernetes.io/name: {{ .name }}
{{- with .service.podLabels }}
{{ toYaml . | nindent 8 }}
{{- end }}
    spec:
{{- if and .service.serviceAccount .service.serviceAccount.create }}
      serviceAccountName: {{ .service.serviceAccount.name | default .name }}
{{- end }}
{{- with .service.nodeSelector }}
      nodeSelector:
{{ toYaml . | nindent 8 }}
{{- end }}
{{- with .service.tolerations }}
      tolerations:
{{ toYaml . | nindent 8 }}
{{- end }}
{{- with .service.affinity }}
      affinity:
{{ toYaml . | nindent 8 }}
{{- end }}
      containers:
        - name: {{ .name }}
          image: {{ include "marketplace.image" (dict "root" .root "name" .name "service" .service) }}
          imagePullPolicy: {{ .root.Values.global.image.pullPolicy | default "IfNotPresent" }}
          ports:
            - name: http
              containerPort: {{ .service.containerPort | default 8080 }}
{{- if .service.env }}
          env:
{{ toYaml .service.env | nindent 12 }}
{{- end }}
{{- $hasEnvFrom := or .service.envFromGlobalConfig .service.envFromGlobalSecret .service.extraEnvFrom }}
{{- if $hasEnvFrom }}
          envFrom:
{{- if .service.envFromGlobalConfig }}
            - configMapRef:
                name: global-config
{{- end }}
{{- if .service.envFromGlobalSecret }}
            - secretRef:
                name: global-secret
{{- end }}
{{- with .service.extraEnvFrom }}
{{ toYaml . | nindent 12 }}
{{- end }}
{{- end }}
{{- with .service.resources }}
          resources:
{{ toYaml . | nindent 12 }}
{{- end }}
{{- with .service.readinessProbe }}
          readinessProbe:
{{ toYaml . | nindent 12 }}
{{- end }}
{{- with .service.livenessProbe }}
          livenessProbe:
{{ toYaml . | nindent 12 }}
{{- end }}
{{- end -}}
