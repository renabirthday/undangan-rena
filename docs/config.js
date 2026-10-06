// Isi detail yang belum tersedia. Tanggal lahir tidak dipakai sebagai tanggal acara.
window.INVITATION = {
  draft: true,
  name: 'Rena',
  fullName: 'Adrena Nadisya Kurniawan',
  age: 1,
  parents: 'Ayah & Bunda Rena',
  // Contoh format: '2026-10-11T15:00:00+07:00'. Isi tanggal acara yang sebenarnya.
  startsAt: '2026-10-11T11:00:00+07:00',
  endsAt: '',
  timeZone: 'Asia/Jakarta',
  timeLabel: '11.00 WIB – selesai',
  venue: 'Citra Indah City Jonggol',
  address: 'Cluster Agave Blok i16 No. 15',
  mapsUrl: 'https://www.google.com/maps?q=-6.4554869,107.0386424&z=17&hl=en',
  // Cukup letakkan foto JPG bernama rena.jpg di docs/assets. Tempat foto tetap
  // terlihat bila berkas belum tersedia. Untuk nama/format lain, ubah nilai ini.
  photo: 'assets/renabirthday1.jpeg',
  photoPosition: 'center',
  // Album: cukup masukkan foto-01.jpg sampai foto-06.jpg ke docs/assets/album.
  // Tambah/hapus baris untuk mengubah jumlah foto. Caption bebas Bos ubah.
  gallery: [
    { src: 'assets/album/Foto-01.jpeg', alt: 'Foto pertama Rena', caption: 'Senyum kecil, bahagia besar.' },
    { src: 'assets/album/Foto-02.jpeg', alt: 'Foto pertama Rena', caption: 'Senyum kecil, bahagia besar.' },
    { src: 'assets/album/Foto-03.jpeg', alt: 'Foto pertama Rena', caption: 'Senyum kecil, bahagia besar.' },
    { src: 'assets/album/Foto-04.jpeg', alt: 'Foto pertama Rena', caption: 'Senyum kecil, bahagia besar.' },
    { src: 'assets/album/Foto-05.jpeg', alt: 'Foto pertama Rena', caption: 'Senyum kecil, bahagia besar.' },
    { src: 'assets/album/Foto-06.jpeg', alt: 'Foto pertama Rena', caption: 'Senyum kecil, bahagia besar.' },
    { src: 'assets/album/Foto-07.jpeg', alt: 'Foto kedua Rena', caption: 'Hari-hari yang manis.' },
    { src: 'assets/album/Foto-08.jpeg', alt: 'Foto ketiga Rena', caption: 'Banyak cinta untuk Rena.' },
    { src: 'assets/album/Foto-09.jpeg', alt: 'Foto keempat Rena', caption: 'Cerita kecil yang berharga.' },
    { src: 'assets/album/foto-10.jpeg', alt: 'Foto kelima Rena', caption: 'Tumbuh bersama kasih sayang.' },
    { src: 'assets/album/foto-11.jpeg', alt: 'Foto keenam Rena', caption: 'Satu tahun penuh cinta.' }
  ],
  // Cukup masukkan backsound.mp3 ke docs/assets. Musik mulai setelah Buka undangan.
  music: 'assets/backsound.mp3',
  musicTitle: 'Musik untuk hari kecil Rena',
  musicVolume: 0.35,
  musicLoop: true,
  animations: true,
  // URL deployment Google Apps Script berakhiran /exec; lihat panduan.
  rsvpUrl: ''
};
