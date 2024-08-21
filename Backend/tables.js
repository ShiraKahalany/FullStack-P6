// User Class
class User {
    constructor(id, username, password, role, email, loyalty_points) {
      this.id = id;
      this.username = username;
      this.password = password;
      this.role = role; // manager or customer
      this.email = email;
      this.loyalty_points = loyalty_points; // integer
    }
  }
  
  // Movie Class
  class Movie {
    constructor(id, title, description, genre, runtime, cast, release_date, poster_url, trailer_url, is_vip_available, is_3d_available, is_4d_available, rating, reviews) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.genre = genre;
      this.runtime = runtime;
      this.cast = cast;
      this.release_date = release_date;
      this.poster_url = poster_url;
      this.trailer_url = trailer_url;
      this.is_vip_available = is_vip_available; // boolean
      this.rating = rating; // float
      this.reviews = reviews; // JSON
    }
  }
  
  // Theater Class
  class Theater {
    constructor(id, name, type, seat_layout, vip_seats, total_seats) {
      this.id = id;
      this.name = name;
      this.type = type; // normal, vip, or 4d
      this.seat_layout = seat_layout; // JSON
      this.vip_seats = vip_seats; // integer
      this.total_seats = total_seats; // integer
    }
  }
  
  // Showtime Class
  class Showtime {
    constructor(id, movie_id, theater_id, show_date, show_time, available_seats, price) {
      this.id = id;
      this.movie_id = movie_id; // Foreign Key
      this.theater_id = theater_id; // Foreign Key
      this.show_date = show_date;
      this.show_time = show_time;
      this.available_seats = available_seats; // JSON
      this.price = price; // float
    }
  }
  
  // Booking Class
  class Booking {
    constructor(id, user_id, showtime_id, seats, total_price, purchase_date, loyalty_points_earned) {
      this.id = id;
      this.user_id = user_id; // Foreign Key
      this.showtime_id = showtime_id; // Foreign Key
      this.seats = seats; // JSON
      this.total_price = total_price;
      this.purchase_date = purchase_date;
      this.loyalty_points_earned = loyalty_points_earned; // integer
    }
  }
  
  // Voucher Class
  class Voucher {
    constructor(id, booking_id, voucher_type, voucher_price) {
      this.id = id;
      this.booking_id = booking_id; // Foreign Key
      this.voucher_type = voucher_type; // popcorn or 3d
      this.voucher_price = voucher_price;
    }
  }
  
  // Media Class (MongoDB)
  class Media {
    constructor(media_id, movie_id, type, url, metadata) {
      this.media_id = media_id;
      this.movie_id = movie_id; // Foreign Key
      this.type = type; // poster or trailer
      this.url = url;
      this.metadata = metadata; // JSON
    }
  }
  
  // Log Class (MongoDB)
  class Log {
    constructor(log_id, user_id, action, timestamp) {
      this.log_id = log_id;
      this.user_id = user_id; // Foreign Key
      this.action = action; // description of the action performed
      this.timestamp = timestamp;
    }
  }
  
  module.exports = {
    User,
    Movie,
    Theater,
    Showtime,
    Booking,
    Voucher,
    Media,
    Log
  };
  