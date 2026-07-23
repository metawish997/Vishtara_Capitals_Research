const Ticket = require('../models/Ticket');
const MasterNotification = require('../models/notification/MasterNotification');
const { processMedia } = require('../utils/fileHandler');

exports.getTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find().sort('-createdAt').populate('user', 'name email');
    res.status(200).json({ success: true, count: tickets.length, data: tickets });
  } catch (error) { next(error); }
};

exports.getUserTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: tickets.length, data: tickets });
  } catch (error) { next(error); }
};

exports.createTicket = async (req, res, next) => {
  try {
    req.body.user = req.user.id;

    if (req.file) {
      const processedMedia = await processMedia(req.file, 'tickets');
      req.body.attachment = processedMedia.url;
    }

    const ticket = await Ticket.create(req.body);
    
    // Create notification for the user
    await MasterNotification.create({
      type: 'Ticket',
      severity: 'success',
      title: 'Support Ticket Created',
      message: `Your support ticket regarding "${ticket.subject}" has been successfully created. We will get back to you shortly.`,
      user: req.user.id,
      data: { screen: 'SupportPage', ticketId: ticket._id }
    });

    res.status(201).json({ success: true, data: ticket });
  } catch (error) { next(error); }
};

exports.updateTicket = async (req, res, next) => {
  try {
    let ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    
    const oldStatus = ticket.status;

    ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (req.body.status === 'Resolved' && !ticket.resolved_at) {
      ticket.resolved_at = Date.now();
      const diffTime = Math.abs(ticket.resolved_at - ticket.opened_at);
      ticket.resolution_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      await ticket.save();
    }

    if (oldStatus !== ticket.status) {
      if (ticket.status === 'Open') {
        await MasterNotification.create({
          type: 'Ticket',
          severity: 'info',
          title: 'Ticket Opened',
          message: `An admin is now reviewing your support ticket regarding "${ticket.subject}".`,
          user: ticket.user,
          data: { screen: 'SupportPage', ticketId: ticket._id }
        });
      } else if (ticket.status === 'Resolved') {
        await MasterNotification.create({
          type: 'Ticket',
          severity: 'success',
          title: 'Ticket Resolved',
          message: `Your support ticket regarding "${ticket.subject}" has been resolved.`,
          user: ticket.user,
          data: { screen: 'SupportPage', ticketId: ticket._id }
        });
      }
    }

    res.status(200).json({ success: true, data: ticket });
  } catch (error) { next(error); }
};

exports.deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    await ticket.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};
