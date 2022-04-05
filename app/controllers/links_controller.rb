class LinksController < ApplicationController
  def index
    @links = Link.all.order(created_at: :desc)
    @link = Link.new
  end

  def create
    @link = Link.new link_params
    if @link.save
      redirect_to root_path
    else
      render :index, notice: 'nope!'
    end
  end

  private

  def link_params
    params.require(:link).permit(:name)
  end
end
