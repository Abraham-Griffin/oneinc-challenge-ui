import React, { useState, useEffect } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { Header } from "./components/Header";
import { Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
function Encode() {
  const [isLoading, setIsLoading] = useState(false);
  const [encoding, setEncoding] = useState("");
  const [hubConnection, setHubConnection] = useState(null);
  useEffect(() => {
    const hubConn = new HubConnectionBuilder()
      .withUrl("http://localhost:5204/encodingHub")
      .build();

    setHubConnection(hubConn);
  }, []);

  useEffect(() => {
    if (hubConnection) {
      hubConnection.on("ReceiveMessage", (message, delay) => {
        console.log(`Random delay: ${delay}`);
        let currentValue = document.getElementById("output-encoding").value;
        document.getElementById("output-encoding").value =
          currentValue + message;
      });
      hubConnection.on("FinishEncoding", () => {
        setIsLoading(false);
      });
      hubConnection
        .start()
        .then(() => {
          console.log("Connection started!");
        })
        .catch((err) => console.error(err));
    }
  }, [hubConnection]);

  const encodeString = () => {
    if (hubConnection) {
      setIsLoading(true);
      hubConnection.invoke("Encode", encoding).catch((err) => {
        return console.error(err.toString());
      });
    }
  };
  const cancelProcess = () => {
    hubConnection.stop();
    setIsLoading(false);

    Swal.fire({
      icon: "error",
      title: "Process has been canceled",
    });
  };
  return (
    <>
      <Header />
      <div className="container text-center mt-5">
        <h1>Encoding String</h1>
        <div className="row offset-4 mt-4">
          <div className="col-md-6">
            <label className="form-label">Encode string:</label>
            <input
              type="text"
              value={encoding}
              className="form-control"
              onChange={(e) => setEncoding(e.target.value)}
            />
          </div>
        </div>
        <div className="row offset-3">
          <Button
            id="encode-button"
            className="btn col-md-4 mt-4"
            onClick={encodeString}
            disabled={isLoading}
          >
            {isLoading && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
            )}
            Convert
          </Button>
          <Button
            id="cancel-button"
            className="btn btn-danger col-md-4 mt-4"
            onClick={cancelProcess}
          >
            Cancel Process
          </Button>
        </div>

        <div className="col-md-4 offset-4 mt-5">
          <label className="form-label">Encoded string response:</label>
          <input id="output-encoding" type="textbox" className="form-control" />
        </div>
      </div>
    </>
  );
}

export default Encode;
