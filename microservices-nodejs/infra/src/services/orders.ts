import { cluster } from "../cluster";
import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";

import { ordersDockerImage } from "../images/orders";
import { amqpListener } from "./rabbitmq";
import { appLoadBalancer } from "../load-balancer";

const ordersTargetGroup = appLoadBalancer.createTargetGroup("orders-target", {
  port: 3333,
  protocol: "HTTP",
  healthCheck: {
    path: "/health",
    protocol: "HTTP",
  },
});

export const ordersHttpListener = appLoadBalancer.createListener(
  "orders-listener",
  {
    port: 3333,
    protocol: "HTTP",
    targetGroup: ordersTargetGroup,
  },
);

export const ordersService = new awsx.classic.ecs.FargateService(
  "fargate-orders",
  {
    cluster,
    desiredCount: 1,
    waitForSteadyState: false,
    taskDefinitionArgs: {
      container: {
        image: ordersDockerImage.ref,
        cpu: 256,
        memory: 512,
        portMappings: [ordersHttpListener],
        environment: [
          {
            name: "BROKER_URL",
            value: pulumi.interpolate`amqp://admin:admin@${amqpListener.endpoint.hostname}:${amqpListener.endpoint.port}`,
          },
          {
            name: "DATABASE_URL",
            value:
              "postgresql://neondb_owner:npg_t0YfprmWkn9l@ep-divine-mode-aupb2h9a.c-10.us-east-1.aws.neon.tech/neondb?sslmode=require",
          },
          {
            name: "OTEL_TRACES_EXPORTER",
            value: "otlp",
          },
          {
            name: "OTEL_EXPORTER_OTLP_ENDPOINT",
            value: "https://otlp-gateway-prod-sa-east-1.grafana.net/otlp",
          },
          {
            name: "OTEL_EXPORTER_OTLP_HEADERS",
            value:
              "Authorization=Basic%20MTcyOTQ5MzpnbGNfZXlKdklqb2lNVGcxTURnd01pSXNJbTRpT2lKbGRtVnVkQzF2Y21SbGNuTWlMQ0pySWpvaWFHUTNlbUpIWlVZNU0xWlpNRzgyTUhreWFUYzNORXhSSWl3aWJTSTZleUp5SWpvaWNISnZaQzF6WVMxbFlYTjBMVEVpZlgwPQ==",
          },
          {
            name: "OTEL_SERVICE_NAME",
            value: "orders",
          },
          {
            name: "OTEL_RESOURCE_ATTRIBUTES",
            value:
              "service.name=orders,service.namespace=eventonodejs,deployment.environment=production",
          },
          {
            name: "OTEL_NODE_RESOURCE_DETECTORS",
            value: "env,host,os",
          },
          {
            name: "OTEL_NODE_ENABLED_INSTRUMENTATIONS",
            value: "http,fastify,pg,amqplib",
          },
        ],
      },
    },
  },
);

// postgresql://neondb_owner:npg_OoKrIwU0Xz9f@ep-tiny-rice-au765o5l.c-10.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
