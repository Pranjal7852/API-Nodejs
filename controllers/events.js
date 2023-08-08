const { getStaticUrl, getRelativePath } = require('../helpers/string');
const db = require('../prisma/db');
const fs = require('fs/promises');

/** @type {import("express").RequestHandler} */
exports.getEvents = async (req, res) => {
  try {
    const { limit, page, type, id, username } = req.query;

    const events = await db.event.findMany({
      where: {
        AND: [
          { type: { equals: type } },
          { id: { equals: parseInt(id) || undefined } },
          { username: { equals: username } },
        ],
      },
      take: parseInt(limit) || undefined,
      skip: parseInt(limit) * parseInt(page - 1) || undefined,
      orderBy: { from: 'asc' },
    });

    res.json(events);
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: { ...error, message: error.message } });
  }
};

/** @type {import("express").RequestHandler} */
exports.createEvent = async (req, res) => {
  try {
    // create event data

    const event = { ...req.body };
    if (req.files.image) event.image = getStaticUrl(req.files.image?.[0]?.path);
    else event.image = undefined;
    if (req.files.pdf) event.pdf = getStaticUrl(req.files.pdf?.[0]?.path);
    else event.pdf = undefined;
    event.username = req.username;

    //checking if the user is authorised
    if (!['ADMIN', 'CLUB'].includes(req.user.role)) {
      const error = new Error('You are not authorized to do this action');
      error.status = 401;
      throw error;
    }
    // store in db
    await db.event.create({
      data: event,
    });
    res.json(event);
  } catch (error) {
    console.log(error);
    const imagepath = req.files.image?.[0]?.path;
    const pdfpath = req.files.pdf?.[0]?.path;
    if (imagepath)
      fs.unlink(getRelativePath(imagepath))
        .then((val) => console.log(`Deleted File  ${imagepath} ${val}`))
        .catch((err) => console.log(err));

    if (pdfpath)
      fs.unlink(getRelativePath(pdfpath))
        .then((val) => console.log(`Deleted File  ${pdfpath} ${val}`))
        .catch((err) => console.log(err));

    res
      .status(error.status || 500)
      .json({ error: { ...error, message: error.message } });
  }
};

/** @type {import("express").RequestHandler} */
exports.updateEvent = async (req, res) => {
  try {
    let { id } = req.params;
    id = parseInt(id);

    const existingEvent = await db.event.findUnique({
      where: { id },
    });
    if (!existingEvent) {
      const error = new Error('Event not found');
      error.status = 404;
      throw error;
    }
    let {
      name,
      type,
      shortDescription,
      description,
      from,
      to,
      venue,
      registrationUrl,
      image,
      pdf,
      updatedAt,
      username,
    } = req.body;

    if (!(req.user.role == 'ADMIN' || req.username == existingEvent.username)) {
      const error = new Error(
        `Unauthorized - you need to be ADMIN or ${existingEvent.username} to edit this event`
      );
      error.status = 401;
      throw error;
    }

    if (req.files.image) event.image = getStaticUrl(req.files.image?.[0]?.path);
    else image = undefined;
    if (req.files.pdf) event.pdf = getStaticUrl(req.files.pdf?.[0]?.path);
    else pdf = undefined;

    const event = await db.event.update({
      where: { id },
      data: {
        name,
        type,
        shortDescription,
        description,
        from,
        to,
        venue,
        registrationUrl,
        image,
        pdf,
        updatedAt,
        username,
      },
    });

    // remove old files
    if (req.files.image) {
      fs.unlink(getRelativePath(existingEvent.image))
        .then(() => console.log('Deleted File ' + existingEvent.image))
        .catch((err) => console.log(err));
    }
    if (req.files.pdf) {
      fs.unlink(getRelativePath(existingEvent.pdf))
        .then(() => console.log('Deleted File ' + existingEvent.pdf))
        .catch((err) => console.log(err));
    }

    res.json(event);
  } catch (error) {
    console.log(error);
    const imagepath = req.files.image?.[0]?.path;
    const pdfpath = req.files.pdf?.[0]?.path;
    if (imagepath)
      fs.unlink(getRelativePath(imagepath))
        .then((val) => console.log(`Deleted File  ${imagepath} ${val}`))
        .catch((err) => console.log(err));

    if (pdfpath)
      fs.unlink(getRelativePath(pdfpath))
        .then((val) => console.log(`Deleted File  ${pdfpath} ${val}`))
        .catch((err) => console.log(err));

    res
      .status(error.status || 500)
      .json({ error: { ...error, message: error.message } });
  }
};

/** @type {import("express").RequestHandler} */
exports.deleteEvent = async (req, res) => {
  try {
    let { id } = req.params;
    id = parseInt(id);
    const existingEvent = await db.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return res.status(404).json({
        error: 'Event not found',
      });
    }

    if (!(req.user.role == 'ADMIN' || req.username == existingEvent.username)) {
      return res.status(401).json({
        error: {
          message: `Unauthorized - you need to be ADMIN or ${existingEvent.username} to edit this event`,
        },
      });
    }

    const event = await db.event.delete({
      where: { id },
    });

    console.log('Deleted event', existingEvent);
    // remove old file
    fs.unlink(getRelativePath(existingEvent.image))
      .then(() => console.log('Deleted File ' + existingEvent.image))
      .catch((err) => console.log(err));

    fs.unlink(getRelativePath(existingEvent.pdf))
      .then(() => console.log('Deleted File ' + existingEvent.pdf))
      .catch((err) => console.log(err));

    res.json(event);
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: { ...error, message: error.message } });
  }
};
