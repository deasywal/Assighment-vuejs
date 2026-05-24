const { createApp } = Vue;

createApp({
    data() {
        return {
            kurirList: [
                { kode: "REG", nama: "Reguler (3-5 hari)" },
                { kode: "EXP", nama: "Ekspres (1-2 hari)" }
            ],
            paketList: [
                { kode: "PAKET-UT-001", nama: "PAKET IPS Dasar", isi: ["EKMA4116","EKMA4115"], harga: 120000 },
                { kode: "PAKET-UT-002", nama: "PAKET IPA Dasar", isi: ["BIOL4201","FISIP4001"], harga: 140000 }
            ],
            // Inisialisasi awal manifes dengan penomoran tahun berjalan 2026
            trackingList: [
                { noDO: "DO2026-001", nim: "123456789", nama: "Rina Wulandari", ekspedisi: "Reguler (3-5 hari)", paketKode: "PAKET-UT-001", detailIsi: ["EKMA4116","EKMA4115"], tanggalKirim: "2026-05-10", totalHarga: 120000 }
            ],
            paketTerpilih: null,
            formDO: { nim: "", nama: "", ekspedisi: "", tanggalKirim: new Date().toISOString().split('T')[0] }
        };
    },
    computed: {
        // Menghasilkan nomor DO otomatis berurutan sesuai tahun saat ini (Indikator 4)
        generateNextDONumber() {
            const tahunSekarang = new Date().getFullYear();
            const prefix = `DO${tahunSekarang}-`;
            
            let urutTerakhir = 0;
            this.trackingList.forEach(item => {
                if (item.noDO.startsWith(prefix)) {
                    const strSeq = item.noDO.replace(prefix, "");
                    const numSeq = parseInt(strSeq, 10);
                    if (numSeq > urutTerakhir) urutTerakhir = numSeq;
                }
            });

            const urutBerikutnya = urutTerakhir + 1;
            return `${prefix}${String(urutBerikutnya).padStart(3, '0')}`;
        }
    },
    watch: {
        // Watcher 1: Memantau log aktivitas entri data NIM mahasiswa di form
        'formDO.nim'(newNIM) {
            console.log(`[Watcher 1] Input NIM mendeteksi masukan: ${newNIM}`);
        },
        // Watcher 2: Menangkap perubahan paket untuk kalkulasi nominal anggaran pengunci harga (Kriteria 1.5)
        paketTerpilih(newPaket) {
            if (newPaket && newPaket !== 'null') {
                console.log(`[Watcher 2] Paket Terpilih: ${newPaket.nama}, Harga Terkunci: Rp ${newPaket.harga}`);
            }
        }
    },
    methods: {
        prosesSimpanDO() {
            if (!this.paketTerpilih || this.paketTerpilih === 'null') {
                alert("Silakan tentukan pilihan paket!");
                return;
            }

            this.trackingList.push({
                noDO: this.generateNextDONumber,
                nim: this.formDO.nim,
                nama: this.formDO.nama,
                ekspedisi: this.formDO.ekspedisi,
                paketKode: this.paketTerpilih.kodePaket, 
                detailIsi: [...this.paketTerpilih.isi],
                tanggalKirim: this.formDO.tanggalKirim,
                totalHarga: this.paketTerpilih.harga
            });

            // Reset Form ke kondisi awal agar siap menerima input baru berikutnya
            this.formDO.nim = "";
            this.formDO.nama = "";
            this.formDO.ekspedisi = "";
            this.paketTerpilih = null;
            this.formDO.tanggalKirim = new Date().toISOString().split('T')[0];
            alert("Pengiriman Delivery Order berhasil ditambahkan ke manifes!");
        }
    }
}).mount('#app');