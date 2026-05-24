const { createApp } = Vue;

createApp({
    data() {
        return {
            // Data Dummy 
            upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
            kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
            stokBahanAjar: [
                { kode: "EKMA4116", judul: "Pengantar Manajemen", kategori: "MK Wajib", upbjj: "Jakarta", lokasiRak: "R1-A3", harga: 65000, qty: 28, safety: 20, catatanHTML: "<em>Edisi 2024, cetak ulang</em>" },
                { kode: "EKMA4115", judul: "Pengantar Akuntansi", kategori: "MK Wajib", upbjj: "Jakarta", lokasiRak: "R1-A4", harga: 60000, qty: 7, safety: 15, catatanHTML: "<strong>Cover baru</strong>" },
                { kode: "BIOL4201", judul: "Biologi Umum (Praktikum)", kategori: "Praktikum", upbjj: "Surabaya", lokasiRak: "R3-B2", harga: 80000, qty: 12, safety: 10, catatanHTML: "Butuh <u>pendingin</u> untuk kit basah" },
                { kode: "FISIP4001", judul: "Dasar-Dasar Sosiologi", kategori: "MK Pilihan", upbjj: "Makassar", lokasiRak: "R2-C1", harga: 55000, qty: 2, safety: 8, catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder" }
            ],

            filters: { upbjj: "", kategori: "", butuhReorder: false },
            sortBy: "judul",
            formTambah: { kode: "", judul: "", kategori: "", upbjj: "", lokasiRak: "", qty: 0, safety: 0, harga: 0, catatanHTML: "" },
            errorForm: "",
            editingIndex: null,
            formEdit: { kode: "", qty: 0, safety: 0 }
        };
    },
    computed: {
        // Computed Property filter & sort agar tidak run recompute berulang (Kriteria 1.4)
        filteredStokBahanAjar() {
            let result = [...this.stokBahanAjar];

            if (this.filters.upbjj) {
                result = result.filter(item => item.upbjj === this.filters.upbjj);
            }
            if (this.filters.kategori) {
                result = result.filter(item => item.kategori === this.filters.kategori);
            }
            if (this.filters.butuhReorder) {
                result = result.filter(item => item.qty < item.safety || item.qty === 0);
            }

            result.sort((a, b) => {
                if (this.sortBy === 'judul') return a.judul.localeCompare(b.judul);
                if (this.sortBy === 'qty') return a.qty - b.qty;
                if (this.sortBy === 'harga') return a.harga - b.harga;
                return 0;
            });
            return result;
        }
    },
    watch: {
        // Watcher 1: Mereset kategori jika filter UT-Daerah kosong (Dependent Option)
        'filters.upbjj'(newVal) {
            if (!newVal) this.filters.kategori = "";
            console.log(`[Watcher 1] Daerah berubah menjadi: ${newVal || 'Semua'}`);
        },
        // Watcher 2: Memantau total produk kritis secara reaktif (Kriteria 1.5)
        stokBahanAjar: {
            handler(newStok) {
                const kritis = newStok.filter(i => i.qty < i.safety || i.qty === 0).length;
                console.log(`[Watcher 2] Data terupdate! Total item kritis reorder saat ini: ${kritis}`);
            },
            deep: true
        }
    },
    methods: {
        tambahBahanAjar() {
            if (!this.formTambah.kode || !this.formTambah.judul) {
                this.errorForm = "Sila isi kolom bertanda bintang!";
                return;
            }
            const duplikat = this.stokBahanAjar.some(i => i.kode.toUpperCase() === this.formTambah.kode.toUpperCase());
            if (duplikat) {
                this.errorForm = "Kode MK sudah ada!";
                return;
            }
            this.stokBahanAjar.push({ ...this.formTambah });
            this.errorForm = "";
            this.formTambah = { kode: "", judul: "", kategori: "", upbjj: "", lokasiRak: "", qty: 0, safety: 0, harga: 0, catatanHTML: "" };
            alert("Bahan ajar berhasil ditambahkan!");
        },
        inisialisasiEdit(item) {
            this.formEdit.kode = item.kode;
            this.formEdit.qty = item.qty;
            this.formEdit.safety = item.safety;
            this.editingIndex = this.stokBahanAjar.findIndex(i => i.kode === item.kode);
        },
        simpanEdit() {
            if (this.editingIndex !== null) {
                this.stokBahanAjar[this.editingIndex].qty = this.formEdit.qty;
                this.stokBahanAjar[this.editingIndex].safety = this.formEdit.safety;
                this.editingIndex = null;
                alert("Stok berhasil diperbarui!");
            }
        },
        resetFilters() {
            this.filters = { upbjj: "", kategori: "", butuhReorder: false };
            this.sortBy = "judul";
        }
    }
}).mount('#app');