import { MQTTPubSub } from "graphql-mqtt-subscriptions";
import { connect } from "mqtt";

const client = connect(process.env.MQTT_HOST || "mqtt://localhost", {
  reconnectPeriod: 1000
});

export const pubSub = new MQTTPubSub({
  client
}); // connecting to mqtt://localhost by default
