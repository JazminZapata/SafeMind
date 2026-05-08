from app import create_app, socketio

app = create_app()

if __name__ == '__main__':
    host = '0.0.0.0'
    port = 5000

    print("\n==============================")
    print("🚀 Backend SafeMind iniciado")
    print(f"🌐 Local: http://127.0.0.1:{port}")
    print(f"📱 Red:   http://192.168.0.29:{port}")
    print("==============================\n")

    socketio.run(
        app,
        host=host,
        port=port,
        debug=True,
        use_reloader=False
    )