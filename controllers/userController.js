import User from '../models/User.js';

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const { username, avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { username, avatar },
      { new: true }
    ).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addContact = async (req, res) => {
  try {
    const { email } = req.body;

    const contact = await User.findOne({ email });
    if (!contact)
      return res.status(404).json({ message: 'Contact not found' });

    if (req.userId === String(contact._id))
      return res.status(400).json({ message: 'Cannot add yourself' });

    const user = await User.findById(req.userId);

    if (!user.contacts.includes(contact._id))
      user.contacts.push(contact._id);

    if (!contact.contacts.includes(req.userId))
      contact.contacts.push(req.userId);

    await user.save();
    await contact.save();

    res.json({ message: 'Contact added mutually' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
  
  export const getContacts = async (req, res) => {
    try {
      const user = await User.findById(req.userId).populate("contacts", "username email");
      res.json({ contacts: user.contacts });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  

  export const getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("email name avatar");
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({ user });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };