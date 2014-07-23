/*
 * Q-municate chat application
 *
 * Dialog View Module
 *
 */

module.exports = DialogView;

var Dialog, FriendList;

function DialogView(app) {
  this.app = app;
  Dialog = this.app.models.Dialog;
  FriendList = this.app.models.FriendList;
}

DialogView.prototype = {

  createDataSpinner: function() {
    var spinnerBlock = '<div class="popup-elem spinner_bounce">';
    spinnerBlock += '<div class="spinner_bounce-bounce1"></div>';
    spinnerBlock += '<div class="spinner_bounce-bounce2"></div>';
    spinnerBlock += '<div class="spinner_bounce-bounce3"></div>';
    spinnerBlock += '</div>';

    $('#emptyList').after(spinnerBlock);
  },

  removeDataSpinner: function() {
    $('.l-sidebar .spinner_bounce').remove();
  },

  downloadDialogs: function(rosterItems) {
    var self = this,
        dialog;

    scrollbar();
    self.createDataSpinner();

    Dialog.download(function(dialogs) {
      self.removeDataSpinner();

      if (dialogs.length > 0) {

        for (var i = 0, len = dialogs.length; i < len; i++) {
          dialog = Dialog.create(dialogs[i]);

          // updating the Contact List whereto are included all users with which maybe you will be to chat
          FriendList.create(dialog.occupants_ids, rosterItems, function() {
            self.addDialogItem(dialog);
            if (QMCONFIG.debug) console.log('Contact list is created', FriendList);
          });
        }

      } else {
        $('#emptyList').removeClass('is-hidden');
      }
    });
  },

  hideDialogs: function() {
    // $('.l-list').addClass('is-hidden');
    // $('.l-list ul').html('');
  },

  addDialogItem: function(dialog) {
    var FriendList = this.app.models.FriendList.contacts,
        icon = dialog.type === 3 ? FriendList[dialog.contact_id].avatar_url : QMCONFIG.defAvatar.group_url,
        name = dialog.type === 3 ? FriendList[dialog.contact_id].full_name : dialog.name,
        status = dialog.type === 3 ? FriendList[dialog.contact_id].subscription : 'none',
        html,
        startOfCurrentDay;

    html = '<li class="list-item" data-dialog="'+dialog.id+'" data-contact="'+dialog.contact_id+'">';
    html += '<a class="contact l-flexbox" href="#">';
    html += '<div class="l-flexbox_inline">';
    html += '<img class="contact-avatar avatar" src="' + icon + '" alt="user">';
    html += '<span class="name">' + name + '</span>';
    html += '</div>';
    if (status === 'none')
      html += '<span class="status status_request"></span>';
    else
      html += '<span class="status"></span>';
    html += '</a></li>';

    startOfCurrentDay = new Date;
    startOfCurrentDay.setHours(0,0,0,0);

    if (new Date(dialog.last_message_date_sent * 1000) > startOfCurrentDay)
      $('#recentList').removeClass('is-hidden').find('ul').append(html);
    else
      $('#historyList').removeClass('is-hidden').find('ul').append(html);
  }

};

/* Private
---------------------------------------------------------------------- */
function scrollbar() {
  $('.l-sidebar .scrollbar').mCustomScrollbar({
    theme: 'minimal-dark',
    scrollInertia: 150
  });
}
