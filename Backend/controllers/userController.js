const User = require("../models/User");

exports.getAllBrokers = async (req, res) => {
  try {
    const brokers = await User.find({ role: "broker" })
      .select(
        "_id name email phone role isActive isVerified createdAt updatedAt"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: brokers.length,
      brokers,
    });

  } catch (err) {
    console.error("GET BROKERS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch brokers",
    });
  }
};





exports.addBroker = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      verified,
    } = req.body;

    /* =====================
       VALIDATION
    ===================== */
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        error: "All required fields must be filled",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        error: "Passwords do not match",
      });
    }

    if (!verified) {
      return res.status(400).json({
        error: "Please confirm broker verification",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        error: "Broker with this email already exists",
      });
    }

    /* =====================
       CREATE BROKER
    ===================== */
    const broker = await User.create({
      name,
      email,
      phone,
      password, // 🔐 hashed automatically by schema
      role: "broker",
      isVerified: true,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      broker: {
        _id: broker._id,
        name: broker.name,
        email: broker.email,
      },
    });

  } catch (err) {
    console.error("ADD BROKER ERROR:", err);
    return res.status(500).json({
      error: "Failed to add broker",
    });
  }
};
