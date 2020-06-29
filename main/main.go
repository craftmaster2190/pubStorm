package main

import (
  "flag"
  "io"
  "log"
  "net/http"
)

var addr = flag.String("addr", ":8080", "http service address")

func serveHome(w http.ResponseWriter, r *http.Request) {
  log.Println(r.URL)
  if r.URL.Path != "/" {
    http.Error(w, "Not found", http.StatusNotFound)
    return
  }
  if r.Method != "GET" {
    http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
    return
  }

  _, err := io.WriteString(w, "Server is up.")
  if err != nil {
    log.Print("response failure:", err)
  }
}

// serveWs handles websocket requests from the peer.
func serveWs(hub *Hub, w http.ResponseWriter, r *http.Request) {
  conn, err := upgrader.Upgrade(w, r, nil)
  if err != nil {
    log.Println(err)
    return
  }
  client := &Client{hub: hub, conn: conn, send: make(chan []byte, 256)}
  client.hub.register <- client

  // Allow collection of memory referenced by the caller by doing all work in
  // new goroutines.
  go client.writePump()
  go client.readPump()
}

func main() {
  flag.Parse()
  hub := newHub()
  go hub.run()
  http.HandleFunc("/", serveHome)
  http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
    serveWs(hub, w, r)
  })
  log.Print("ListenAndServe: Start...")
  err := http.ListenAndServe(*addr, nil)
  if err != nil {
    log.Fatal("ListenAndServe: ", err)
  }
}
