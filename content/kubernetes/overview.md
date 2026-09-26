---
title: نظرة عامة على كوبرنيتيس
description: معمارية كوبرنيتيس الرئيسية والعناصر التي تدير التطبيقات.
category: kubernetes
order: 1
level: beginner
tags: [kubernetes, architecture]
language: ar
---

## ما هو كوبرنيتيس؟

كوبرنيتيس (Kubernetes) نظام لتجميع الحاويات وتنسيقها (Container Orchestrator).
يتكفل بجدولة (Scheduling) الحاويات على العقد (Nodes)، وإعادة تشغيلها عند الفشل،
وتوزيع الحمولة (Load Balancing).

## المعمارية بمخطط

```mermaid
graph TD
    User[User / kubectl] --> APIServer[API Server]
    APIServer --> ETCD[etcd]
    APIServer --> Scheduler[Scheduler]
    APIServer --> Controller[Controller Manager]
    Scheduler --> Kubelet[kubelet]
    Controller --> Kubelet
    Kubelet --> Pod[Pod]
```

## العناصر الأساسية

| المكوّن       | الدور                                              |
| ------------- | -------------------------------------------------- |
| `Pod`         | أصغر وحدة نشر، تحتوي حاوية أو أكثر                |
| `Deployment`  | يدير نسخ (Replicas) وتحديثات التطبيق               |
| `Service`     | عنوان ثابت للوصول إلى مجموعات البودات              |
| `Namespace`   | تقسيم منطقي للموارد داخل العنقود (Cluster)         |
