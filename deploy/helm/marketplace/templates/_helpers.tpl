{{- define "marketplace.labels" -}}
app.kubernetes.io/managed-by: Helm
app.kubernetes.io/part-of: marketplace
{{- end -}}

{{- define "marketplace.serviceName" -}}
{{- if .service.serviceName -}}
{{- .service.serviceName -}}
{{- else -}}
{{- .name -}}
{{- end -}}
{{- end -}}

{{- define "marketplace.image" -}}
{{- $registry := .root.Values.global.image.registry | default "" -}}
{{- $tag := .root.Values.global.image.tag | default "latest" -}}
{{- $imageName := .service.imageName | default .name -}}
{{- if $registry -}}
{{ printf "%s/%s:%s" $registry $imageName $tag }}
{{- else -}}
{{ printf "%s:%s" $imageName $tag }}
{{- end -}}
{{- end -}}
