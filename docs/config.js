// Isi detail yang belum tersedia. Tanggal lahir tidak dipakai sebagai tanggal acara.
window.INVITATION = {
  draft: true,
  name: 'Rena',
  fullName: 'Adrena Nadisya Kurniawan',
  age: 1,
  parents: 'Papi & Mami Rena',
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
    { src: 'assets/album/Foto-01.jpeg', alt: 'Foto pertama Rena', caption: 'Hari pertama, cinta untuk selamanya.' },
    { src: 'assets/album/Foto-02.jpeg', alt: 'Foto kedua Rena', caption: 'Tidur mungilmu, damai di hati kami.' },
    { src: 'assets/album/Foto-03.jpeg', alt: 'Foto ketiga Rena', caption: 'Mata kecil, penuh rasa ingin tahu.' },
    { src: 'assets/album/Foto-04.jpeg', alt: 'Foto keempat Rena', caption: 'Duduk santai, ditemani cinta.' },
    { src: 'assets/album/Foto-05.jpeg', alt: 'Foto kelima Rena', caption: 'Tengkurap dulu, menjelajah kemudian!' },
    { src: 'assets/album/Foto-06.jpeg', alt: 'Foto keenam Rena', caption: 'Pipi gemas, kesayangan Papi dan Mami.' },
    { src: 'assets/album/Foto-07.jpeg', alt: 'Foto ketujuh Rena', caption: 'Senyum jahil yang bikin hati meleleh.' },
    { src: 'assets/album/Foto-08.jpeg', alt: 'Foto kedelapan Rena', caption: 'Belajar duduk, siap melihat dunia.' },
    { src: 'assets/album/Foto-09.jpeg', alt: 'Foto kesembilan Rena', caption: 'Dua kuncir kecil, sejuta kebahagiaan.' },
    { src: 'assets/album/Foto-10.jpeg', alt: 'Foto kesepuluh Rena', caption: 'Setiap hari, ada cerita baru bersamamu.' },
    { src: 'assets/album/Foto-11.jpeg', alt: 'Foto kesebelas Rena', caption: 'Satu tahun Rena, seumur hidup cinta kami' }
  ],
  // Cukup masukkan backsound.mp3 ke docs/assets. Musik mulai setelah Buka undangan.
  music: 'assets/HAPPY BIRTHDAY PIANO.mp3',
  musicTitle: 'Musik untuk hari kecil Rena',
  musicVolume: 0.35,
  musicLoop: true,
  animations: true,
  // URL deployment Google Apps Script berakhiran /exec; lihat panduan.
  rsvpUrl: ''
};
