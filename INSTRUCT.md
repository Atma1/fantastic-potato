Anda diminta membuat REST API sederhana menggunakan AdonisJS versi 5 dan PostgreSQL untuk sistem chatbot. API ini memungkinkan pengguna mengirimkan pertanyaan, menyimpan pertanyaan dan jawaban dari API eksternal, serta menampilkan atau menghapus pesan.

Fitur yang Harus Diimplementasikan

    1. Kirim Pertanyaan (POST /questions)
    • Endpoint ini menerima input pertanyaan dari pengguna.
    • Data question disimpan ke PostgreSQL (tabel Conversation-+-Messages).
    • Lakukan request ke API eksternal: https://api.majadigidev.jatimprov.go.id/api/external/chatbot/send-message
Docs (https://documentation-api-majadigi-beckend.vercel.app/chatbot.html)
Note: Session_id bisa random string/uuid
    • Response API external disimpan sebagai message dari bot.
    • Kembalikan response jawaban ke pengguna.
Note: Post Input dan Response tidak ada ketentuan (bebas)

    2. Ambil semua Conversation  (GET /conversation)
    • Endpoint ini untuk menampilkan semua conversation pesan dari database.
    • Filter dengan query param (poin tambahan)
    3. Ambil message dari Conversation  (GET /conversation/:id_or_uuid)
    • Endpoint ini untuk menampilkan data pesan dari conversation di database.


Ketentuan Teknis
    1. Gunakan AdonisJS versi 5
    2. Gunakan PostgreSQL sebagai database
    3. Gunakan migration untuk membuat tabel PostgreSQL:
    • Tabel Conversation memiliki:
    • id
    • sesion_id
    • messages_id
    • last_messages

    • Tabel messages memiliki:
    • Id
    • sender_type
    • Message

    4. Gunakan Axios atau HttpContext.client lain untuk request ke API eksternal
    5. Return value dari API external terdapat di bawah

{
    "data": {
        "message": [
            {
                "text": "Majadigi menyediakan berbagai layanan yang dikelompokkan berdasarkan kategori. Beberapa layanan yang tersedia di Majadigi antara lain:\n\n1. **Layanan Sosial**: Menyediakan informasi dan layanan sosial yang berfokus pada kesejahteraan masyarakat. Namun, saat ini layanan ini belum tersedia.\n\n2. **Layanan Lingkungan Hidup**: Menyediakan informasi dan pelayanan pengelolaan lingkungan yang berkelanjutan. Saat ini juga belum tersedia.\n\n3. **Layanan Kabupaten & Kota**: Menyediakan layanan yang mendukung administrasi Kabupaten & Kota. Salah satu contoh adalah **Smart Kampung Banyuwangi**, yang merupakan aplikasi untuk warga Banyuwangi.\n\n4. **Layanan Ekonomi dan Bisnis**: Menyediakan beragam informasi dan layanan yang disesuaikan dengan kebutuhan warga Jawa Timur. Salah satu contohnya adalah **Rumah ASN**, yang menjawab keluhan ASN dan masyarakat umum seputar kepegawaian.\n\n<br>",
                "properties": {
                    "source": {
                        "id": "OpenAIModel-b1JlZ",
                        "display_name": "OpenAI",
                        "source": "gpt-4o-mini"
                    },
                    "icon": "OpenAI",
                    "allow_markdown": false,
                    "state": "complete",
                    "text_color": "",
                    "background_color": ""
                },
                "category": "message",
                "id": "1ba0d94b-4144-4f3c-a877-f19d2e08d867",
                "flow_id": "0694164d-b46c-477c-b7c6-0b7902c7fbad",
                "suggest_links": [
                    {
                        "title": "Layanan Sosial",
                        "link": "https://majadigi.jatimprov.go.id/sosial"
                    },
                    {
                        "title": "Layanan Lingkungan Hidup",
                        "link": "https://majadigi.jatimprov.go.id/lingkungan-hidup"
                    },
                    {
                        "title": "Layanan Kabupaten & Kota",
                        "link": "https://majadigi.jatimprov.go.id/kabupaten-&-kota"
                    },
                    {
                        "title": "Layanan Ekonomi dan Bisnis",
                        "link": "https://majadigi.jatimprov.go.id/ekonomi-dan-bisnis"
                    }
                ]
            }
        ],
        "sessionId": "0694164d-b46c-477c-b7c6-0b7902c7fbad"
    },
    "statusCode": 200,
    "message": "OK"
}