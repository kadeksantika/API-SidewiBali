'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable('tb_akun', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true // Menambahkan auto increment
      },
      email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(60),
        allowNull: false
      },
      nama: {
        type: Sequelize.STRING(25),
        allowNull: false
      },
      no_telp: {
        type: Sequelize.STRING(15),
        allowNull: false
      },
      foto: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      },
      role: {
        type: Sequelize.STRING(12),
        allowNull: false
      },
      token: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: null
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.createTable('tb_desawisata', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true // Menambahkan auto increment
      },
      gambar: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      alamat: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      nama: {
        type: Sequelize.STRING(25),
        allowNull: false
      },
      deskripsi: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      maps: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      kategori: {
        type: Sequelize.ENUM('Rintisan', 'Berkembang', 'Maju', 'Mandiri'),
        allowNull: false
      },
      kabupaten: {
        type: Sequelize.ENUM('Badung', 'Bangli', 'Jembrana', 'Klungkung', 'Karangasem', 'Gianyar', 'Tabanan', 'Denpasar', 'Buleleng'),
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING(35),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.createTable('tb_kategoridestinasi', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true // Menambahkan auto increment
      },
      nama: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.createTable('tb_destinasiwisata', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true // Menambahkan auto increment
      },
      deskripsi: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      nama: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      gambar: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      id_kategoridestinasi: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tb_kategoridestinasi',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_desawisata: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tb_desawisata',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      slug: {
        type: Sequelize.STRING(60),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.createTable('tb_admindesa', {
      id_desawisata: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tb_desawisata',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_akun: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tb_akun',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.createTable('tb_akomodasi', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true // Menambahkan auto increment
      },
      nama: {
        type: Sequelize.STRING(25),
        allowNull: false
      },
      gambar: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      kategori: {
        type: Sequelize.ENUM('Villa', 'Hotel', 'Penginapan'),
        allowNull: false
      },
      id_desawisata: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tb_desawisata',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      slug: {
        type: Sequelize.STRING(35),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.createTable('tb_assetdesa', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true // Menambahkan auto increment
      },
      link: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      tipe: {
        type: Sequelize.ENUM('Foto', 'Video'),
        allowNull: false
      },
      id_desawisata: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tb_desawisata',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

      await queryInterface.createTable('tb_assetdestinasi', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true // Menambahkan auto increment
      },
      link: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      tipe: {
        type: Sequelize.ENUM('Foto', 'Video'),
        allowNull: false
      },
      id_destinasiwisata: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tb_destinasiwisata',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.createTable('tb_berita', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true // Menambahkan auto increment
      },
      judul: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      gambar: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      isi_berita: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING(60),
        allowNull: false
      },
      id_desawisata: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tb_desawisata',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.createTable('tb_destinasifavorit', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true // Menambahkan auto increment
      },
      id_destinasiwisata: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tb_destinasiwisata',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_akun: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tb_akun',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.createTable('tb_fasilitas', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true // Menambahkan auto increment
      },
      id_destinasiwisata: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tb_destinasiwisata',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      nama: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.createTable('tb_informasi', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true // Menambahkan auto increment
      },
      no_telp: {
        type: Sequelize.STRING(15),
        allowNull: false
      },
      no_wa: {
        type: Sequelize.STRING(15),
        allowNull: false
      },
      facebook: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      instagram: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      website: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      id_desawisata: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tb_desawisata',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.createTable('tb_notifikasi', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true // Menambahkan auto increment
      },
      deskripsi: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      id_akun: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tb_akun',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });

    await queryInterface.createTable('tb_paketwisata', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true // Menambahkan auto increment
      },
      deskripsi: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      nama: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      gambar: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      harga: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      id_desawisata: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tb_desawisata',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      slug: {
        type: Sequelize.STRING(60),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.createTable('tb_desafavorit', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true // Menambahkan auto increment
      },
      id_desawisata: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tb_desawisata',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_akun: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tb_akun',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.createTable('tb_produk', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true // Menambahkan auto increment
      },
      deskripsi: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      nama: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      gambar: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      harga: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      id_desawisata: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tb_desawisata',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      slug: {
        type: Sequelize.STRING(60),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.createTable('tb_reviewdestinasi', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true // Menambahkan auto increment
      },
      id_akun: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tb_akun',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_destinasiwisata: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tb_destinasiwisata',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      review: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      setujui: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tb_akun');
    await queryInterface.dropTable('tb_desawisata');
    await queryInterface.dropTable('tb_destinasiwisata');
    await queryInterface.dropTable('tb_admindesa');
    await queryInterface.dropTable('tb_akomodasi');
    await queryInterface.dropTable('tb_assetdesa');
    await queryInterface.dropTable('tb_assetdestinasi');
    await queryInterface.dropTable('tb_berita');
    await queryInterface.dropTable('tb_destinasifavorit');
    await queryInterface.dropTable('tb_fasilitas');
    await queryInterface.dropTable('tb_desafavorit');
    await queryInterface.dropTable('tb_informasi');
    await queryInterface.dropTable('tb_kategoridestinasi');
    await queryInterface.dropTable('tb_notifikasi');
    await queryInterface.dropTable('tb_paketwisata');
    await queryInterface.dropTable('tb_produk');
    await queryInterface.dropTable('tb_reviewdestinasi');
  }
};
