"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, XCircle, Users, Server, Globe, Clock } from "lucide-react"

interface ServerInfo {
  online: boolean
  host: string
  port: number
  version?: {
    name_clean?: string
  }
  players?: {
    online?: number
    max?: number
  }
  motd?: {
    clean?: string
    html?: string
  }
  retrieved_at: number
}

export default function ServerPinger() {
  const [address, setAddress] = useState("")
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setServerInfo(null)

    try {
      const response = await fetch(`/api/ping?address=${encodeURIComponent(address)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to ping server")
      }

      setServerInfo(data)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Minecraft Server Pinger</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="address">Server Address</Label>
            <Input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g., mc.hypixel.net"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Pinging..." : "Ping Server"}
          </Button>
        </form>

        {error && (
          <div className="flex items-center space-x-2 text-red-500 mb-4">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {serverInfo && (
          <div className="space-y-6">
            <div className={`flex items-center space-x-2 ${serverInfo.online ? "text-green-500" : "text-red-500"}`}>
              {serverInfo.online ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
              <p className="font-semibold">{serverInfo.online ? "Server is online!" : "Server is offline"}</p>
            </div>
            {serverInfo.online && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Server size={20} />
                    <div>
                      <p className="text-sm text-muted-foreground">Version</p>
                      <p className="font-medium">{serverInfo.version?.name_clean || "Unknown"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users size={20} />
                    <div>
                      <p className="text-sm text-muted-foreground">Players</p>
                      <p className="font-medium">
                        {serverInfo.players?.online ?? "Unknown"} / {serverInfo.players?.max ?? "Unknown"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe size={20} />
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">
                        {serverInfo.host}:{serverInfo.port}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock size={20} />
                    <div>
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p className="font-medium">{new Date(serverInfo.retrieved_at).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">MOTD</p>
                  <p
                    className="font-medium"
                    dangerouslySetInnerHTML={{ __html: serverInfo.motd?.html || "No MOTD available" }}
                  ></p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Server Icon</p>
                  <img
                    src={`https://api.mcstatus.io/v2/icon/${encodeURIComponent(address)}`}
                    alt="Server Icon"
                    className="w-16 h-16 rounded"
                  />
                </div>
              </>
            )}
            <div>
              <p className="text-sm text-muted-foreground mb-1">API Response</p>
              <pre className="bg-black text-green-400 p-2 rounded-md text-xs overflow-auto">
                {JSON.stringify(serverInfo, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

