const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;
    const { adminId } = req.body;
    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    //TODO: Check if adminId is valid, importing adminModel is not woking currently
    // const adminIdObjectId = new mongoose.Types.ObjectId(adminId);
    // // Validate adminId
    // const adminExists = await adminModel.findOne({ _id: adminIdObjectId });
    // if (!adminExists) {
    //   return res.json({
    //     success: false,
    //     message: "Admin not found or Not Authorized, Login Again",
    //   });
    // }

    // const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    // if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
    //   return res.json({
    //     success: false,
    //     message: "Not Authorized Login Again",
    //   });
    // }

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default adminAuth;
