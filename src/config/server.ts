import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { Application } from "express";

export const createHttpServer = (app: Application) => {
  return http.createServer(app);
};

export const createHttpsServer = (app: Application) => {
  const key = fs.readFileSync(path.resolve(__dirname, "../../../certs/key.pem"));
  const cert = fs.readFileSync(path.resolve(__dirname, "../../../certs/cert.pem"));
  return https.createServer({ key, cert }, app);
}
