//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

// app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/albumsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const albumSchema = {
  title: String,
  song: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Song",
  },
};

const Album = mongoose.model("Album", albumSchema);

const songSchema = {
  title: String,
};

const Song = mongoose.model("Song", songSchema);

///////////////////////////////////Requests Targetting all Articles////////////////////////

app
  .route("/albums")

  .get(function (req, res) {
    Album.find(function (err, foundAlbums) {
      if (!err) {
        res.send(foundAlbums);
      } else {
        res.send(err);
      }
    });
  })

  .post(function (req, res) {
    const newAlbum = new Album({
      title: req.body.title,
      song: req.body.song,
    });

    newAlbum.save(function (err) {
      if (!err) {
        res.send("Successfully added a new album.");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function (req, res) {
    Album.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all albums.");
      } else {
        res.send(err);
      }
    });
  });

// ////////////////////////////////Requests Targetting A Specific Article////////////////////////

app
  .route("/albums/:albumTitle")
  .get(function (req, res) {
    Album.findOne({ title: req.params.albumTitle })
      .populate("song")
      .exec(function (err, receivedData) {
        if (err) return handleError(err);
        res.send(receivedData);
      });
  })

  .put(function (req, res) {
    Album.update(
      { title: req.params.albumTitle },
      { title: req.body.title },
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send("Successfully updated the selected album.");
        }
      }
    );
  })

  .patch(function (req, res) {
    Album.update(
      { title: req.params.albumTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Successfully updated albuum.");
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete(function (req, res) {
    Album.deleteOne({ title: req.params.albumTitle }, function (err) {
      if (!err) {
        res.send("Successfully deleted the corresponding album.");
      } else {
        res.send(err);
      }
    });
  });

app
  .route("/songs")

  .get(function (req, res) {
    Song.find(function (err, foundSongs) {
      if (!err) {
        console.log(foundSongs);
        res.send(foundSongs);
      } else {
        res.send(err);
      }
    });
  })

  .post(function (req, res) {
    const newSong = new Song({
      title: req.body.title,
    });

    newSong.save(function (err) {
      if (!err) {
        res.send("Successfully added a new song.");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function (req, res) {
    Song.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all song.");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
