import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import validator from 'validator';

export async function signup(req, res) {
    try {
        const { email, password, username } = req.body;

        // Kiểm tra các trường thông tin
        if (!email || !password || !username) {
            return res.status(400).json({ success: false, message: "Tất cả các trường đều bắt buộc" });
        }

        // Kiểm tra email hợp lệ
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Email không hợp lệ" });
        }

        // Kiểm tra độ dài mật khẩu
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Mật khẩu phải có ít nhất 6 ký tự" });
        }

        // Kiểm tra email đã tồn tại
        const existingUserByEmail = await User.findOne({ email: email });
        if (existingUserByEmail) {
            return res.status(400).json({ success: false, message: "Email này đã tồn tại" });
        }

        // Kiểm tra username đã tồn tại
        const existingUserByUsername = await User.findOne({ username: username });
        if (existingUserByUsername) {
            return res.status(400).json({ success: false, message: "Username đã tồn tại" });
        }

        // Mã hóa mật khẩu
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Avatar ngẫu nhiên
        const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];
        const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

        // Tạo user mới
        const newUser = new User({
            email,
            password: hashedPassword,
            username,
            image,
        });

        // Lưu user vào DB và tạo token
        await newUser.save();
        generateTokenAndSetCookie(newUser._id, res);

        // Trả về dữ liệu người dùng, loại bỏ mật khẩu
        res.status(201).json({
            success: true,
            user: {
                ...newUser._doc,
                password: "",  // Không trả mật khẩu
            },
        });
    } catch (error) {
        console.log("Lỗi đăng ký:", error.message);
        res.status(500).json({ success: false, message: "Lỗi server nội bộ" });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Kiểm tra nếu email và password đã được truyền
        if (!email || !password) {
            console.log("Lỗi: Thiếu email hoặc mật khẩu"); // Debug log
            return res.status(400).json({ success: false, message: "Tất cả các trường đều bắt buộc" });
        }

        console.log("Email nhận được:", email);  // Debug log
        console.log("Mật khẩu nhận được:", password);  // Debug log

        // Tìm người dùng theo email
        const user = await User.findOne({ email: email });
        if (!user) {
            console.log("Lỗi: Không tìm thấy người dùng với email:", email);  // Debug log
            return res.status(404).json({ success: false, message: "Thông tin đăng nhập không hợp lệ" });
        }

        // Kiểm tra xem mật khẩu trong cơ sở dữ liệu có tồn tại
        if (!user.password) {
            console.log("Lỗi: Mật khẩu không tồn tại trong cơ sở dữ liệu");  // Debug log
            return res.status(500).json({ success: false, message: "Lỗi hệ thống, không tìm thấy mật khẩu" });
        }

        console.log("Mật khẩu trong cơ sở dữ liệu:", user.password);  // Debug log

        // Kiểm tra xem mật khẩu có hợp lệ không
        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if (!isPasswordCorrect) {
            console.log("Lỗi: Mật khẩu không chính xác");  // Debug log
            return res.status(400).json({ success: false, message: "Thông tin đăng nhập không hợp lệ" });
        }

        // Tạo token và gửi cookie
        generateTokenAndSetCookie(user._id, res);

        // Trả về dữ liệu người dùng, loại bỏ mật khẩu
        res.status(200).json({
            success: true,
            user: {
                ...user._doc,
                password: "",  // Không trả mật khẩu
            },
        });
    } catch (error) {
        console.log("Lỗi đăng nhập:", error.message); // Debug log lỗi nếu có
        res.status(500).json({ success: false, message: "Lỗi server nội bộ" });
    }
}

export async function logout(req, res) {
    try {
        // Xóa cookie jwt-netflix
        res.clearCookie("jwt-netflix", { httpOnly: true, secure: process.env.NODE_ENV === "development" });
        res.status(200).json({ success: true, message: "Đăng xuất thành công" });
    } catch (error) {
        console.log("Lỗi đăng xuất:", error.message);
        res.status(500).json({ success: false, message: "Lỗi server nội bộ" });
    }
}

export async function authCheck(req, res) {
    try {
        // Kiểm tra nếu người dùng đã được xác thực
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Người dùng chưa đăng nhập" });
        }

        // Trả về thông tin người dùng
        res.status(200).json({
            success: true,
            user: req.user,
        });
    } catch (error) {
        console.log("Lỗi kiểm tra xác thực:", error.message);
        res.status(500).json({ success: false, message: "Lỗi server nội bộ" });
    }
}
