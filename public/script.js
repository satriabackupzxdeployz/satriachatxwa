document.getElementById('sendForm').addEventListener('submit', async (e) => {
    e.preventDefault()

    const submitBtn = document.getElementById('submitBtn')
    const btnText = submitBtn.querySelector('.btn-text')
    const btnLoading = submitBtn.querySelector('.btn-loading')
    const responseDiv = document.getElementById('response')

    const target = document.getElementById('target').value.trim()
    const text = document.getElementById('text').value.trim()

    if (!target || !text) {
        showResponse('Mohon isi nomor tujuan dan pesan', 'error')
        return
    }

    if (!/^[0-9]{10,15}$/.test(target)) {
        showResponse('Nomor WhatsApp tidak valid (10-15 digit angka)', 'error')
        return
    }

    submitBtn.disabled = true
    btnText.style.display = 'none'
    btnLoading.style.display = 'inline'
    responseDiv.style.display = 'none'

    try {
        const response = await fetch('/api/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ target, text })
        })

        const data = await response.json()

        if (data.status === 'success') {
            showResponse('✅ Pesan berhasil dikirim ke ' + target, 'success')
            document.getElementById('text').value = ''
        } else {
            showResponse('❌ ' + (data.message || 'Gagal mengirim pesan'), 'error')
        }
    } catch (error) {
        showResponse('❌ Gagal terhubung ke server', 'error')
    } finally {
        submitBtn.disabled = false
        btnText.style.display = 'inline'
        btnLoading.style.display = 'none'
    }
})

function showResponse(message, type) {
    const responseDiv = document.getElementById('response')
    responseDiv.textContent = message
    responseDiv.className = 'response ' + type
    responseDiv.style.display = 'block'

    setTimeout(() => {
        responseDiv.style.display = 'none'
    }, 5000)
}document.getElementById