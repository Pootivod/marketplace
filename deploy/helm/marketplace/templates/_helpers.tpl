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

{{- define "marketplace.imagePullPolicy" -}}
{{- $image := .service.image | default dict -}}
{{- get $image "pullPolicy" | default .root.Values.global.image.pullPolicy | default "IfNotPresent" -}}
{{- end -}}

{{- define "marketplace.image" -}}
{{- $image := .service.image | default dict -}}
{{- $registry := .root.Values.global.image.registry | default "" -}}
{{- $globalTag := .root.Values.global.image.tag | default "latest" -}}
{{- $repository := get $image "repository" | default "" -}}
{{- $imageName := get $image "name" | default (.service.imageName | default .name) -}}
{{- $tag := get $image "tag" | default $globalTag -}}
{{- if $repository -}}
{{ printf "%s:%s" $repository $tag }}
{{- else if $registry -}}
{{ printf "%s/%s:%s" $registry $imageName $tag }}
{{- else -}}
{{ printf "%s:%s" $imageName $tag }}
{{- end -}}
{{- end -}}