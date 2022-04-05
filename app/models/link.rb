class Link < ApplicationRecord
  before_save { refactoring_of_link }

  URL_REGEXP = /\A(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?\Z/i

  validates :name, format: { with: URL_REGEXP, message: 'You provided invalid URL' }

  private

  def refactoring_of_link
    url = URI.parse(name)

    if name.include?('http')
      self.name = PublicSuffix.domain(url.host)
    elsif name.include?('www.')
      self.name = url.path.split('/')[0].split('www.')[1]
    else
      self.name = url.path.split('/')[0]
    end
  end
end
