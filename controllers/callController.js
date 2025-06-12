export const startCall = (req, res) => {
    const { to, signalData } = req.body;
    req.io.to(to).emit('call:user', {
      from: req.userId,
      signal: signalData,
    });
    res.status(200).json({ message: 'Call initiated' });
  };
  
  export const answerCall = (req, res) => {
    const { to, signalData } = req.body;
    req.io.to(to).emit('call:accepted', {
      signal: signalData,
    });
    res.status(200).json({ message: 'Call accepted' });
  };
  
  export const endCall = (req, res) => {
    const { to } = req.body;
    req.io.to(to).emit('call:ended', {
      from: req.userId,
    });
    res.status(200).json({ message: 'Call ended' });
  };
  