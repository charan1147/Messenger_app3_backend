export const startCall = (req, res) => {
  const { to, signalData } = req.body;

  if (!to || !signalData)
    return res.status(400).json({ message: 'Missing recipient or signal data' });

  req.io.to(to).emit('call:user', {
    from: req.user._id || req.userId,
    signal: signalData,
  });

  res.status(200).json({ message: 'Call initiated' });
};

export const answerCall = (req, res) => {
  const { to, signalData } = req.body;

  if (!to || !signalData)
    return res.status(400).json({ message: 'Missing recipient or signal data' });

  req.io.to(to).emit('call:accepted', {
    signal: signalData,
  });

  res.status(200).json({ message: 'Call accepted' });
};

export const endCall = (req, res) => {
  const { to } = req.body;

  if (!to)
    return res.status(400).json({ message: 'Missing recipient ID' });

  req.io.to(to).emit('call:ended', {
    from: req.user._id || req.userId,
  });

  res.status(200).json({ message: 'Call ended' });
};
