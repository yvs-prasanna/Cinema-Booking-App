const Database = require('../src/config/database');
const setupDatabase = require('./setup');

const seedData = async () => {
  try {
    console.log('🌱 Seeding database...');
    
    await Database.connect();
    
    // Clear existing data
    console.log('Clearing existing data...');
    const tables = [
      'payments', 'food_order_items', 'food_orders', 'seat_holds',
      'booked_seats', 'bookings', 'shows', 'seat_layout', 'screens',
      'theaters', 'movies', 'fnb_items', 'admin_users', 'users', 'cities'
    ];
    
    for (const table of tables) {
      await Database.run(`DELETE FROM ${table}`);
    }
    
    // Reset autoincrement
    for (const table of tables) {
      await Database.run(`DELETE FROM sqlite_sequence WHERE name = '${table}'`);
    }
    
    // Seed Cities
    console.log('Seeding cities...');
    const cities = [
      { name: 'Mumbai', state: 'Maharashtra' },
      { name: 'Delhi', state: 'Delhi' },
      { name: 'Bangalore', state: 'Karnataka' },
      { name: 'Chennai', state: 'Tamil Nadu' },
      { name: 'Hyderabad', state: 'Telangana' },
      { name: 'Pune', state: 'Maharashtra' },
      { name: 'Kolkata', state: 'West Bengal' }
    ];
    
    for (const city of cities) {
      await Database.run(
        'INSERT INTO cities (name, state) VALUES (?, ?)',
        [city.name, city.state]
      );
    }
    
    // Seed Theaters
    console.log('Seeding theaters...');
    const theaters = [
      {
        name: 'PVR Phoenix Mall',
        address: 'Phoenix MarketCity, Kurla West, Mumbai',
        cityId: 1,
        totalScreens: 8,
        facilities: JSON.stringify(['Parking', 'Food Court', 'Wheelchair Accessible']),
        latitude: 19.0860,
        longitude: 72.8886
      },
      {
        name: 'INOX Leisure Mall',
        address: 'R City Mall, Ghatkopar West, Mumbai',
        cityId: 1,
        totalScreens: 6,
        facilities: JSON.stringify(['Parking', 'Food Court']),
        latitude: 19.0896,
        longitude: 72.9056
      },
      {
        name: 'PVR Select City Walk',
        address: 'Select City Walk, Saket, Delhi',
        cityId: 2,
        totalScreens: 10,
        facilities: JSON.stringify(['Parking', 'Food Court', 'Wheelchair Accessible', 'IMAX']),
        latitude: 28.5245,
        longitude: 77.2066
      },
      {
        name: 'PVR Forum Mall',
        address: 'Forum Mall, Koramangala, Bangalore',
        cityId: 3,
        totalScreens: 7,
        facilities: JSON.stringify(['Parking', 'Food Court', 'Wheelchair Accessible']),
        latitude: 12.9279,
        longitude: 77.6271
      }
    ];
    
    for (const theater of theaters) {
      await Database.run(`
        INSERT INTO theaters (
          name, address, city_id, total_screens, facilities, 
          latitude, longitude, parking_available, food_court, wheelchair_accessible
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, 1)
      `, [
        theater.name, theater.address, theater.cityId, theater.totalScreens,
        theater.facilities, theater.latitude, theater.longitude
      ]);
    }
    
    // Seed Screens
    console.log('Seeding screens...');
    const screenTypes = ['2D', '3D', 'IMAX', '4DX'];
    const soundSystems = ['Dolby Atmos', 'DTS', 'Dolby Digital'];
    
    let screenId = 1;
    for (let theaterId = 1; theaterId <= 4; theaterId++) {
      const theater = theaters[theaterId - 1];
      
      for (let i = 1; i <= theater.totalScreens; i++) {
        const screenType = screenTypes[Math.floor(Math.random() * screenTypes.length)];
        const soundSystem = soundSystems[Math.floor(Math.random() * soundSystems.length)];
        const totalSeats = 200 + Math.floor(Math.random() * 100); // 200-300 seats
        
        await Database.run(`
          INSERT INTO screens (theater_id, screen_name, screen_type, sound_system, total_seats)
          VALUES (?, ?, ?, ?, ?)
        `, [theaterId, `Screen ${i}`, screenType, soundSystem, totalSeats]);
        
        // Create seat layout for this screen
        const regularRows = ['A', 'B', 'C', 'D', 'E'];
        const premiumRows = ['F', 'G', 'H'];
        const reclinerRows = ['I', 'J'];
        
        // Regular seats
        for (const row of regularRows) {
          for (let seat = 1; seat <= 20; seat++) {
            await Database.run(`
              INSERT INTO seat_layout (screen_id, row_name, seat_number, seat_category)
              VALUES (?, ?, ?, 'regular')
            `, [screenId, row, seat]);
          }
        }
      
        // Premium seats
        for (const row of premiumRows) {
          for (let seat = 1; seat <= 20; seat++) {
            await Database.run(`
              INSERT INTO seat_layout (screen_id, row_name, seat_number, seat_category)
              VALUES (?, ?, ?, 'premium')
            `, [screenId, row, seat]);
          }
        }
        
        // Recliner seats
        for (const row of reclinerRows) {
          for (let seat = 1; seat <= 15; seat++) {
            await Database.run(`
              INSERT INTO seat_layout (screen_id, row_name, seat_number, seat_category)
              VALUES (?, ?, ?, 'recliner')
            `, [screenId, row, seat]);
          }
        }
        
        screenId++;
      }
    }
    
    // Seed Movies
    console.log('Seeding movies...');
    const movies = [
      {
        title: 'Avengers: Endgame',
        synopsis: 'The Avengers assemble once more to reverse the damage caused by Thanos.',
        durationMinutes: 181,
        rating: 'UA',
        genre: JSON.stringify(['Action', 'Adventure', 'Drama']),
        language: JSON.stringify(['English', 'Hindi']),
        formats: JSON.stringify(['2D', '3D', 'IMAX']),
        cast: JSON.stringify([
          { name: 'Robert Downey Jr.', role: 'Tony Stark / Iron Man' },
          { name: 'Chris Evans', role: 'Steve Rogers / Captain America' },
          { name: 'Mark Ruffalo', role: 'Bruce Banner / Hulk' }
        ]),
        crew: JSON.stringify({
          director: 'Anthony Russo, Joe Russo',
          producer: 'Kevin Feige'
        }),
        posterUrl: 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg',
        trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
        releaseDate: '2024-01-01',
        endDate: '2024-12-31',
        imdbRating: 8.4,
        theaterId: 1
      },
      {
        title: 'Spider-Man: No Way Home',
        synopsis: 'Spider-Man seeks help from Doctor Strange to make people forget his identity.',
        durationMinutes: 148,
        rating: 'UA',
        genre: JSON.stringify(['Action', 'Adventure', 'Sci-Fi']),
        language: JSON.stringify(['English', 'Hindi', 'Tamil']),
        formats: JSON.stringify(['2D', '3D', 'IMAX']),
        cast: JSON.stringify([
          { name: 'Tom Holland', role: 'Peter Parker / Spider-Man' },
          { name: 'Benedict Cumberbatch', role: 'Doctor Strange' },
          { name: 'Zendaya', role: 'MJ' }
        ]),
        crew: JSON.stringify({
          director: 'Jon Watts',
          producer: 'Kevin Feige, Amy Pascal'
        }),
        posterUrl: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
        trailerUrl: 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
        releaseDate: '2024-01-15',
        endDate: '2024-12-31',
        imdbRating: 8.2,
        theaterId: 2
      },
      {
        title: 'The Batman',
        synopsis: 'Batman ventures into Gotham City\'s underworld to track a sadistic killer.',
        durationMinutes: 176,
        rating: 'UA',
        genre: JSON.stringify(['Action', 'Crime', 'Drama']),
        language: JSON.stringify(['English', 'Hindi']),
        formats: JSON.stringify(['2D', 'IMAX']),
        cast: JSON.stringify([
          { name: 'Robert Pattinson', role: 'Bruce Wayne / Batman' },
          { name: 'Zoë Kravitz', role: 'Selina Kyle / Catwoman' },
          { name: 'Paul Dano', role: 'The Riddler' }
        ]),
        crew: JSON.stringify({
          director: 'Matt Reeves',
          producer: 'Dylan Clark, Matt Reeves'
        }),
        posterUrl: 'https://images.pexels.com/photos/8434791/pexels-photo-8434791.jpeg',
        trailerUrl: 'https://www.youtube.com/watch?v=mqqft2x_Aa4',
        releaseDate: '2024-02-01',
        endDate: '2024-12-31',
        imdbRating: 7.8,
        theaterId: 3
      },
      {
        title: 'Dune',
        synopsis: 'A noble family becomes embroiled in a war for control over the galaxy\'s most valuable asset.',
        durationMinutes: 155,
        rating: 'UA',
        genre: JSON.stringify(['Action', 'Adventure', 'Drama']),
        language: JSON.stringify(['English', 'Hindi']),
        formats: JSON.stringify(['2D', 'IMAX']),
        cast: JSON.stringify([
          { name: 'Timothée Chalamet', role: 'Paul Atreides' },
          { name: 'Rebecca Ferguson', role: 'Lady Jessica' },
          { name: 'Oscar Isaac', role: 'Duke Leto Atreides' }
        ]),
        crew: JSON.stringify({
          director: 'Denis Villeneuve',
          producer: 'Mary Parent, Denis Villeneuve'
        }),
        posterUrl: 'https://images.pexels.com/photos/8434791/pexels-photo-8434791.jpeg',
        trailerUrl: 'https://www.youtube.com/watch?v=n9xhJrPXop4',
        releaseDate: '2024-02-15',
        endDate: '2024-12-31',
        imdbRating: 8.0,
        theaterId: 4
      },
      {
        title: 'Top Gun: Maverick',
        synopsis: 'After more than thirty years of service, Pete "Maverick" Mitchell is called back.',
        durationMinutes: 130,
        rating: 'UA',
        genre: JSON.stringify(['Action', 'Drama']),
        language: JSON.stringify(['English', 'Hindi']),
        formats: JSON.stringify(['2D', 'IMAX']),
        cast: JSON.stringify([
          { name: 'Tom Cruise', role: 'Pete "Maverick" Mitchell' },
          { name: 'Miles Teller', role: 'Bradley "Rooster" Bradshaw' },
          { name: 'Jennifer Connelly', role: 'Penny Benjamin' }
        ]),
        crew: JSON.stringify({
          director: 'Joseph Kosinski',
          producer: 'Tom Cruise, Christopher McQuarrie'
        }),
        posterUrl: 'https://images.pexels.com/photos/163792/model-planes-airplanes-miniatures-163792.jpeg',
        trailerUrl: 'https://www.youtube.com/watch?v=qSqVVswa420',
        releaseDate: '2024-03-01',
        endDate: '2024-12-31',
        imdbRating: 8.3,
        theaterId: 1
      },
      {
    title: 'Deadpool & Wolverine',
    synopsis: 'Deadpool teams up with Wolverine to stop a multiversal threat.',
    durationMinutes: 128,
    rating: 'A',
    genre: JSON.stringify(['Action', 'Comedy', 'Sci-Fi']),
    language: JSON.stringify(['English', 'Hindi']),
    formats: JSON.stringify(['2D', '3D']),
    cast: JSON.stringify([
      { name: 'Ryan Reynolds', role: 'Wade Wilson / Deadpool' },
      { name: 'Hugh Jackman', role: 'Logan / Wolverine' }
    ]),
    crew: JSON.stringify({
      director: 'Shawn Levy',
      producer: 'Kevin Feige'
    }),
    posterUrl: 'https://image.tmdb.org/t/p/original/deadpool-wolverine.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=video123',
    releaseDate: '2025-07-12',
    endDate: '2025-12-31',
    imdbRating: null,
    theaterId: 2
  },
  {
    title: 'Inside Out 2',
    synopsis: 'Riley’s emotions face new challenges as she becomes a teenager.',
    durationMinutes: 95,
    rating: 'U',
    genre: JSON.stringify(['Animation', 'Comedy', 'Family']),
    language: JSON.stringify(['English', 'Hindi']),
    formats: JSON.stringify(['2D']),
    cast: JSON.stringify([
      { name: 'Amy Poehler', role: 'Joy' },
      { name: 'Maya Hawke', role: 'Anxiety' }
    ]),
    crew: JSON.stringify({
      director: 'Kelsey Mann',
      producer: 'Mark Nielsen'
    }),
    posterUrl: 'https://image.tmdb.org/t/p/original/inside-out-2.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=video456',
    releaseDate: '2025-07-05',
    endDate: '2025-12-31',
    imdbRating: null,
    theaterId: 1
  },
  {
    title: 'Mission: Impossible – Dead Reckoning Part Two',
    synopsis: 'Ethan Hunt faces his greatest mission yet with the fate of the world hanging in balance.',
    durationMinutes: 160,
    rating: 'UA',
    genre: JSON.stringify(['Action', 'Thriller']),
    language: JSON.stringify(['English', 'Hindi']),
    formats: JSON.stringify(['2D', 'IMAX']),
    cast: JSON.stringify([
      { name: 'Tom Cruise', role: 'Ethan Hunt' },
      { name: 'Hayley Atwell', role: 'Grace' }
    ]),
    crew: JSON.stringify({
      director: 'Christopher McQuarrie',
      producer: 'Tom Cruise'
    }),
    posterUrl: 'https://image.tmdb.org/t/p/original/mission-impossible-8.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=video789',
    releaseDate: '2025-08-09',
    endDate: '2025-12-31',
    imdbRating: null,
    theaterId: 3
  }
    ];
    
    for (const movie of movies) {
      await Database.run(`
        INSERT INTO movies (
          title, synopsis, duration_minutes, rating, genre, language, formats,
          cast, crew, poster_url, trailer_url, release_date, end_date, imdb_rating, theater_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        movie.title, movie.synopsis, movie.durationMinutes, movie.rating,
        movie.genre, movie.language, movie.formats, movie.cast, movie.crew,
        movie.posterUrl, movie.trailerUrl, movie.releaseDate, movie.endDate, movie.imdbRating, movie.theaterId
      ]);
    }
    
    // Seed Shows
    console.log('Seeding shows...');
    const showTimes = ['10:00 AM', '1:30 PM', '5:00 PM', '8:30 PM'];
    const formats = ['2D', '3D'];
    const languages = ['English', 'Hindi'];
    
    // Create shows for next 7 days
    const today = new Date();
    for (let day = 0; day < 7; day++) {
      const showDate = new Date(today);
      showDate.setDate(today.getDate() + day);
      const dateString = showDate.toISOString().split('T')[0];
      
      // For each movie
      for (let movieId = 1; movieId <= 5; movieId++) {
        // For each theater (first 2 theaters for simplicity)
        for (let theaterId = 1; theaterId <= 2; theaterId++) {
          // For each screen in theater (first 2 screens)
          for (let screenNum = 1; screenNum <= 2; screenNum++) {
            const screenId = (theaterId - 1) * theaters[theaterId - 1].totalScreens + screenNum;
            
            // Create 2 shows per day per screen
            for (let i = 0; i < 2; i++) {
              const showTime = showTimes[Math.floor(Math.random() * showTimes.length)];
              const format = formats[Math.floor(Math.random() * formats.length)];
              const language = languages[Math.floor(Math.random() * languages.length)];
              
              await Database.run(`
                INSERT INTO shows (
                  movie_id, screen_id, show_date, show_time, format, language,
                  price_regular, price_premium, price_recliner
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
              `, [
                movieId, screenId, dateString, showTime, format, language,
                200, 300, 500
              ]);
            }
          }
        }
      }
    }
    
    // Seed F&B Items
    console.log('Seeding F&B items...');
    const fnbItems = [
      // Popcorn
      { name: 'Regular Salted Popcorn', category: 'Popcorn', size: 'Medium', price: 200, isVeg: true },
      { name: 'Cheese Popcorn', category: 'Popcorn', size: 'Large', price: 350, isVeg: true },
      { name: 'Caramel Popcorn', category: 'Popcorn', size: 'Large', price: 400, isVeg: true },
      
      // Beverages
      { name: 'Coca Cola', category: 'Beverages', size: 'Medium', price: 150, isVeg: true },
      { name: 'Pepsi', category: 'Beverages', size: 'Large', price: 180, isVeg: true },
      { name: 'Fresh Lime Soda', category: 'Beverages', size: 'Medium', price: 120, isVeg: true },
      
      // Snacks
      { name: 'Nachos with Cheese', category: 'Snacks', size: null, price: 250, isVeg: true },
      { name: 'French Fries', category: 'Snacks', size: 'Regular', price: 180, isVeg: true },
      { name: 'Chicken Nuggets', category: 'Snacks', size: '6 pieces', price: 300, isVeg: false },
      
      // Combos
      { name: 'Movie Night Combo', category: 'Combos', size: null, price: 500, isVeg: true, description: 'Large Popcorn + 2 Medium Drinks' },
      { name: 'Family Pack', category: 'Combos', size: null, price: 800, isVeg: true, description: '2 Large Popcorn + 4 Medium Drinks' }
    ];
    
    for (const item of fnbItems) {
      await Database.run(`
        INSERT INTO fnb_items (name, category, size, price, is_veg, description)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [item.name, item.category, item.size, item.price, item.isVeg ? 1 : 0, item.description || null]);
    }
    
    // Seed Sample Users
    console.log('Seeding sample users...');
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('Krishna@2755', 12);
    
    const users = [
            { name: 'John Doe', email: 'john@example.com' },
            { name: 'Jane Smith', email: 'jane@example.com' },
            { name: 'Alice Wonderland', email: 'alice@example.com' },
            { name: 'Bob Builder', email: 'bob@example.com' },
            { name: 'Charlie Brown', email: 'charlie@example.com' },
            { name: 'David Tennant', email: 'david@example.com' },
            { name: 'Eva Green', email: 'eva@example.com' },
            { name: 'Frank Ocean', email: 'frank@example.com' },
            { name: 'Grace Hopper', email: 'grace@example.com' },
            { name: 'Henry Ford', email: 'henry@example.com' },
            { name: 'Irene Adler', email: 'irene@example.com' },
            { name: 'Jack Sparrow', email: 'jack@example.com' },
            { name: 'Karen Page', email: 'karen@example.com' },
            { name: 'Leo Messi', email: 'leo@example.com' },
            { name: 'Monica Bellucci', email: 'monica@example.com' },
            { name: 'Nathan Drake', email: 'nathan@example.com' },
            { name: 'Olivia Wilde', email: 'olivia@example.com' },
            { name: 'Peter Parker', email: 'peter@example.com' },
            { name: 'Quinn Fabray', email: 'quinn@example.com' },
            { name: 'Rachel Green', email: 'rachel@example.com' }
          ];

          for (const user of users) {
            await Database.run(`
              INSERT INTO users (name, email, password_hash, date_of_birth)
              VALUES (?, ?, ?, ?)
            `, [user.name, user.email, hashedPassword, '1990-01-01']);
          }

    
    // Seed Admin User
    await Database.run(`
      INSERT INTO admin_users (username, email, password_hash, role)
      VALUES ('admin', 'admin@cinema.com', ?, 'super_admin')
    `, [hashedPassword]);

    await Database.run(`
      INSERT INTO users (name, email, password_hash)
      VALUES ('admin', 'admin@cinema.com', ?)
    `, [hashedPassword]);

    await Database.run(`INSERT INTO bookings (booking_reference, user_id, show_id, total_seats, total_amount, booking_status, booking_date, user_email, payment_status, cancellation_reason, cancelled_at) VALUES
        ('REF100001', 1, 1, 2, 400.00, 'confirmed', '2025-06-17 10:00:00', 'john@example.com', 'completed', NULL, NULL),
        ('REF100002', 2, 2, 3, 900.00, 'confirmed', '2025-06-17 11:30:00', 'jane@example.com', 'completed', NULL, NULL),
        ('REF100003', 3, 3, 1, 500.00, 'confirmed', '2025-06-17 12:00:00', 'alice@example.com', 'completed', NULL, NULL),
        ('REF100004', 4, 4, 4, 800.00, 'pending', '2025-06-17 13:15:00', 'bob@example.com', 'pending', NULL, NULL),
        ('REF100005', 5, 5, 3, 900.00, 'confirmed', '2025-06-17 14:00:00', 'charlie@example.com', 'completed', NULL, NULL),
        ('REF100006', 1, 6, 2, 1000.00, 'cancelled', '2025-06-17 15:30:00', 'john@example.com', 'refunded', 'Could not attend', '2025-06-17 16:00:00'),
        ('REF100007', 2, 7, 1, 200.00, 'confirmed', '2025-06-17 16:45:00', 'jane@example.com', 'completed', NULL, NULL),
        ('REF100008', 3, 8, 4, 1200.00, 'confirmed', '2025-06-17 18:00:00', 'alice@example.com', 'completed', NULL, NULL),
        ('REF100009', 4, 9, 2, 600.00, 'confirmed', '2025-06-17 19:15:00', 'bob@example.com', 'completed', NULL, NULL),
        ('REF100010', 5, 10, 3, 600.00, 'pending', '2025-06-17 20:30:00', 'charlie@example.com', 'pending', NULL, NULL),
        ('REF100011', 1, 1, 2, 600.00, 'cancelled', '2025-06-16 10:00:00', 'john@example.com', 'refunded', 'Personal emergency', '2025-06-16 10:30:00'),
        ('REF100012', 2, 2, 3, 600.00, 'confirmed', '2025-06-16 11:15:00', 'jane@example.com', 'completed', NULL, NULL),
        ('REF100013', 3, 3, 1, 300.00, 'confirmed', '2025-06-16 12:30:00', 'alice@example.com', 'completed', NULL, NULL),
        ('REF100014', 4, 4, 4, 1600.00, 'confirmed', '2025-06-16 13:45:00', 'bob@example.com', 'completed', NULL, NULL),
        ('REF100015', 5, 5, 2, 400.00, 'confirmed', '2025-06-16 15:00:00', 'charlie@example.com', 'completed', NULL, NULL),
        ('REF100016', 1, 6, 3, 900.00, 'confirmed', '2025-06-16 16:15:00', 'john@example.com', 'completed', NULL, NULL),
        ('REF100017', 2, 7, 1, 500.00, 'confirmed', '2025-06-16 17:30:00', 'jane@example.com', 'completed', NULL, NULL),
        ('REF100018', 3, 8, 2, 600.00, 'pending', '2025-06-16 18:45:00', 'alice@example.com', 'pending', NULL, NULL),
        ('REF100019', 4, 9, 3, 900.00, 'confirmed', '2025-06-16 20:00:00', 'bob@example.com', 'completed', NULL, NULL),
        ('REF100020', 5, 10, 2, 1000.00, 'cancelled', '2025-06-16 21:15:00', 'charlie@example.com', 'refunded', 'Family emergency', '2025-06-16 21:30:00');
      `)

      await Database.run(`INSERT INTO booked_seats (booking_id, seat_id, seat_identifier) VALUES
                        
                        (1, 1, 'A1'),
                        (1, 2, 'A2'),

                        
                        (2, 3, 'F5'),
                        (2, 4, 'F6'),
                        (2, 5, 'F7'),

                      
                        (3, 6, 'I1'),

                       
                        (4, 7, 'B1'),
                        (4, 8, 'B2'),
                        (4, 9, 'B3'),
                        (4, 10, 'B4'),

                     
                        (5, 11, 'G1'),
                        (5, 12, 'G2'),
                        (5, 13, 'G3'),

                    
                        (6, 14, 'J5'),
                        (6, 15, 'J6'),

                     
                        (7, 16, 'C7'),

                 
                        (8, 17, 'F10'),
                        (8, 18, 'F11'),
                        (8, 19, 'F12'),
                        (8, 20, 'F13'),

                
                        (9, 21, 'G7'),
                        (9, 22, 'G8'),

                 
                        (10, 23, 'D1'),
                        (10, 24, 'D2'),
                        (10, 25, 'D3'),

                  
                        (11, 26, 'F3'),
                        (11, 27, 'F4'),

            
                        (12, 28, 'A3'),
                        (12, 29, 'A4'),
                        (12, 30, 'A5'),

                   
                        (13, 31, 'F8'),

           
                        (14, 32, 'I2'),
                        (14, 33, 'I3'),
                        (14, 34, 'I4'),
                        (14, 35, 'I5'),

                      
                        (15, 36, 'E1'),
                        (15, 37, 'E2'),

                 
                        (16, 38, 'G5'),
                        (16, 39, 'G6'),
                        (16, 40, 'G7'),

          
                        (17, 41, 'J8'),

                        (18, 42, 'F14'),
                        (18, 43, 'F15'),

               
                        (19, 44, 'C1'),
                        (19, 45, 'C2'),
                        (19, 46, 'C3'),

            
                        (20, 47, 'I8'),
                        (20, 48, 'I9');
`)




    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Sample Data Summary:');
    console.log('- Cities: 7');
    console.log('- Theaters: 4');
    console.log('- Screens: 31 (8+6+10+7)');
    console.log('- Movies: 5');
    console.log('- Shows: Multiple shows for next 7 days');
    console.log('- F&B Items: 11');
    console.log('- Users: 2 (password: password123)');
    console.log('- Admin: 1 (username: admin, password: password123)');
    console.log('\n🔗 Test Accounts:');
    console.log('User: john@example.com / password123');
    console.log('User: jane@example.com / password123');
    console.log('Admin: admin@cinema.com / password123');
    
    await Database.close();
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  (async () => {
    await setupDatabase();
    await seedData();
  })();
}

module.exports = seedData;