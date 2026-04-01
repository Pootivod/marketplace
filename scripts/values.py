#!/usr/bin/env python3
import argparse
import copy
import json
import os
import sys

try:
    import yaml
except Exception as exc:
    print("PyYAML is required for scripts/values.py", file=sys.stderr)
    raise

def deep_merge(a, b):
    if isinstance(a, dict) and isinstance(b, dict):
        out = copy.deepcopy(a)
        for k, v in b.items():
            if k in out:
                out[k] = deep_merge(out[k], v)
            else:
                out[k] = copy.deepcopy(v)
        return out
    return copy.deepcopy(b)

def load_files(paths):
    merged = {}
    for path in paths:
        if not os.path.exists(path):
            continue
        with open(path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f) or {}
        merged = deep_merge(merged, data)
    return merged

def get_path(data, path, default=None):
    if not path:
        return data
    cur = data
    for part in path.split("."):
        if isinstance(cur, dict) and part in cur:
            cur = cur[part]
        else:
            return default
    return cur

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--file", action="append", required=True)
    sub = parser.add_subparsers(dest="cmd", required=True)

    p = sub.add_parser("get")
    p.add_argument("path")
    p.add_argument("--default", default=None)

    p = sub.add_parser("service-get")
    p.add_argument("service")
    p.add_argument("path")
    p.add_argument("--default", default=None)

    sub.add_parser("enabled-services")
    sub.add_parser("all-services")
    sub.add_parser("list-services")

    args = parser.parse_args()
    data = load_files(args.file)

    if args.cmd == "get":
        val = get_path(data, args.path, args.default)
        if isinstance(val, (dict, list)):
            print(json.dumps(val))
        elif val is None:
            print("" if args.default is None else args.default)
        else:
            print(val)
        return

    services = get_path(data, "services", {}) or {}

    if args.cmd == "service-get":
        svc = services.get(args.service, {})
        val = get_path(svc, args.path, args.default)
        if isinstance(val, (dict, list)):
            print(json.dumps(val))
        elif val is None:
            print("" if args.default is None else args.default)
        else:
            print(val)
        return

    if args.cmd == "enabled-services":
        for name, svc in services.items():
            if bool(svc.get("enabled", False)):
                print(name)
        return

    if args.cmd == "all-services":
        for name in services.keys():
            print(name)
        return

    if args.cmd == "list-services":
        print("SERVICE\tENABLED\tIMAGE\tPORT\tTYPE\tBUILD")
        for name, svc in services.items():
            enabled = str(bool(svc.get("enabled", False))).lower()
            image = svc.get("imageName", name)
            port = (((svc.get("service") or {}).get("port")) or "")
            typ = (((svc.get("service") or {}).get("type")) or "")
            build = (((svc.get("build") or {}).get("type")) or "")
            print(f"{name}\t{enabled}\t{image}\t{port}\t{typ}\t{build}")
        return

if __name__ == "__main__":
    main()
