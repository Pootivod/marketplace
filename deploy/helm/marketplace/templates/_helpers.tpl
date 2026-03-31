{{- define "marketplace.labels" -}}
app: {{ .app }}
{{- end -}}

{{- define "marketplace.image" -}}
{{- printf "%s/%s:%s" .root.Values.image.registry .name .tag -}}
{{- end -}}
