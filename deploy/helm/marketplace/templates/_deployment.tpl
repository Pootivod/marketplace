{{- define "marketplace.deployment" -}}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .name }}
  namespace: {{ .root.Values.namespace.name }}
  labels:
    {{- include "marketplace.labels" (dict "root" .root "app" .name) | nindent 4 }}
spec:
  replicas: {{ .replicas }}
  selector:
    matchLabels:
      app: {{ .name }}
  template:
    metadata:
      labels:
        app: {{ .name }}
    spec:
      {{- with .serviceAccountName }}
      serviceAccountName: {{ . }}
      {{- end }}
      containers:
        - name: {{ .name }}
          image: {{ .image }}
          imagePullPolicy: {{ default .root.Values.image.pullPolicy .imagePullPolicy }}
          {{- with .args }}
          args:
            {{- toYaml . | nindent 12 }}
          {{- end }}
          ports:
            {{- toYaml (default (list (dict "containerPort" 8080)) .ports) | nindent 12 }}
          {{- with (or .env (index .root.Values.security.roles .name)) }}
          env:
            {{- toYaml . | nindent 12 }}
          {{- end }}
          {{- with .envFrom }}
          envFrom:
            {{- toYaml . | nindent 12 }}
          {{- end }}
          {{- with .volumeMounts }}
          volumeMounts:
            {{- toYaml . | nindent 12 }}
          {{- end }}
          {{- with .livenessProbe }}
          livenessProbe:
            {{- toYaml . | nindent 12 }}
          {{- end }}
          {{- with .readinessProbe }}
          readinessProbe:
            {{- toYaml . | nindent 12 }}
          {{- end }}
      {{- with .volumes }}
      volumes:
        {{- toYaml . | nindent 8 }}
      {{- end }}
{{- end -}}

