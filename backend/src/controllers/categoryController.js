import Category from '../models/Category.js';

const defaultCategories = [
  { name: 'Web Dev', slug: 'web-dev', description: 'HTML, CSS, modern JavaScript, frontend frameworks and web stacks.', icon: 'FiCode' },
  { name: 'Programming', slug: 'programming', description: 'Core programming constructs, data structures, algorithms, and logic.', icon: 'FiTerminal' },
  { name: 'Data Science', slug: 'data-science', description: 'Data analysis, Python, Pandas, machine learning, and visualization.', icon: 'FiDatabase' },
  { name: 'Academic', slug: 'academic', description: 'Competitive test prep, mathematics, science fundamentals, and English grammar.', icon: 'FiBookOpen' },
  { name: 'UI/UX Design', slug: 'ui-ux', description: 'Wireframing, prototyping, design systems, and responsive interface design.', icon: 'FiLayout' },
];

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    let categories = await Category.find().sort({ name: 1 });

    if (categories.length === 0) {
      await Category.insertMany(defaultCategories);
      categories = await Category.find().sort({ name: 1 });
    }

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin)
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required.',
      });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const category = await Category.create({
      name,
      slug,
      description: description || '',
      icon: icon || 'FiBookOpen',
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
export const updateCategory = async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    if (name) {
      category.name = name;
      category.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (description !== undefined) category.description = description;
    if (icon) category.icon = icon;

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully.',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
