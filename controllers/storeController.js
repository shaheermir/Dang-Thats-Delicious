const mongoose = require('mongoose')
const multer = require('multer')
const jimp = require('jimp')
const uuid = require('uuid')

const Store = mongoose.model('Store')

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/')
    if (isPhoto) {
      next(null, true)
    } else {
      next({ message: 'That file type is not allowed!' }, false)
    }
  }
}

exports.homePage = (req, res) => {
  res.render('index')
}

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' })
}

exports.upload = multer(multerOptions).single('photo')

exports.resize = async (req, res, next) => {
  if (!req.file) {
    return next()
  }
  const extension = req.file.mimetype.split('/')[1]
  req.body.photo = `${uuid.v4()}.${extension}`

  const photo = await jimp.read(req.file.buffer)
  await photo.resize(800, jimp.AUTO)
  await photo.write(`./public/uploads/${req.body.photo}`)
  next()
}

exports.createStore = async (req, res) => {
  const store = await new Store(req.body).save()
  req.flash('success', `Successfully created ${store.name}. Care to leave a review ?`)
  res.redirect(`/store/${store.slug}`)
}

exports.getStores = async (req, res) => {
  const stores = await Store.find()
  res.render('stores', { title: 'Stores', stores })
}

exports.editStore = async (req, res) => {
  const store = await Store.findOne({ _id: req.params.id })
  //TODO: check if this person owns the store
  res.render('editStore', { title: `Edit ${store.name}`, store })
}

exports.updateStore = async (req, res) => {
  req.body.location.type = 'Point'
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true
  }).exec()
  req.flash(
    'success',
    `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${
      store.slug
    }">View Store</a>`
  )
  res.redirect(`/stores/${store._id}/edit`)
}

exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({ slug: req.params.slug })

  if (!store) {
    return next()
  }

  res.render('store', { store, title: store.name })
}
