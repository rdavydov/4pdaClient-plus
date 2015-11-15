package org.softeg.slartus.forpdaplus.fragments;

import android.animation.ValueAnimator;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBar;
import android.support.v7.app.ActionBarDrawerToggle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.animation.DecelerateInterpolator;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;
import android.widget.SeekBar;
import android.widget.TextView;
import android.widget.Toast;

import com.afollestad.materialdialogs.MaterialDialog;
import com.melnykov.fab.FloatingActionButton;

import org.softeg.slartus.forpdaplus.App;
import org.softeg.slartus.forpdaplus.MainActivity;
import org.softeg.slartus.forpdaplus.R;
import org.softeg.slartus.forpdaplus.TabDrawerMenu;
import org.softeg.slartus.forpdaplus.classes.AdvWebView;
import org.softeg.slartus.forpdaplus.classes.IWebViewContainer;
import org.softeg.slartus.forpdaplus.classes.WebViewExternals;
import org.softeg.slartus.forpdaplus.common.AppLog;
import org.softeg.slartus.forpdaplus.listfragments.IBrickFragment;
import org.softeg.slartus.forpdaplus.prefs.Preferences;
import org.softeg.slartus.forpdaplus.prefs.PreferencesActivity;

import java.util.ArrayList;

/**
 * Created by radiationx on 17.10.15.
 */
public abstract class WebViewFragment extends GeneralFragment implements IBrickFragment, IWebViewContainer{

    public abstract WebView getWebView();
    public abstract View getView();
    public abstract WebViewClient MyWebViewClient();
    public abstract String getTitle();
    public abstract String getUrl();

    WebViewExternals m_WebViewExternals;

    public WebViewExternals getWebViewExternals() {
        if (m_WebViewExternals == null)
            m_WebViewExternals = new WebViewExternals(this);
        return m_WebViewExternals;
    }

    public void animateHamburger(boolean isArrow){
        final DrawerLayout drawerLayout = ((MainActivity)getActivity()).getmMainDrawerMenu().getmDrawerLayout();
        final ActionBarDrawerToggle actionBarDrawerToggle = ((MainActivity)getActivity()).getmMainDrawerMenu().getmDrawerToggle();
        float start = 0, end = 1;

        if(isArrow){
            start = 1; end = 0;
            drawerLayout.setDrawerListener(actionBarDrawerToggle);
        }else{
            drawerLayout.setDrawerListener(null);
        }
        ValueAnimator anim = ValueAnimator.ofFloat(start, end);
        anim.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
            @Override
            public void onAnimationUpdate(ValueAnimator valueAnimator) {
                float slideOffset = (Float) valueAnimator.getAnimatedValue();
                actionBarDrawerToggle.onDrawerSlide(drawerLayout, slideOffset);
            }
        });
        anim.setInterpolator(new DecelerateInterpolator());
        anim.setDuration(250);
        anim.start();
    }

    public void showBody(){
        for(int i = 0; i <= App.getInstance().getTabItems().size()-1; i++){
            if(App.getInstance().getTabItems().get(i).getTag().equals(getTag())) {
                App.getInstance().getTabItems().get(i).setTitle(getTitle());
                App.getInstance().getTabItems().get(i).setUrl(getUrl());
                TabDrawerMenu.notifyDataSetChanged();
                return;
            }
        }
    }
    @Override
    public void onResume() {
        super.onResume();
        getWebView().onResume();
        getWebView().setWebViewClient(MyWebViewClient());
        //animateHamburger(false);
        Log.e("kek", "resume");
    }

    @Override
    public void onPause() {
        //animateHamburger(true);
        super.onPause();
        if (getWebView()!=null) {
            new Handler().postDelayed(new Runnable() {
                @Override
                public void run() {
                    if (getWebView()!=null) getWebView().onPause();
                }
            }, 1500);
            getWebView().setWebViewClient(null);
            getWebView().setPictureListener(null);
        }

        Log.e("kek","pause");
    }

    @Override
    public void onStop() {
        super.onStop();
        if (getWebView()!=null) {
            getWebView().setWebViewClient(null);
            getWebView().setPictureListener(null);
        }
    }

    @Override
    public void onDestroy(){
        if (getWebView() != null){
            getWebView().setWebViewClient(null);
            getWebView().removeAllViews();
            getWebView().loadUrl("about:blank");
        }
        super.onDestroy();
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        Log.e("kek", "fragment save");
        super.onSaveInstanceState(outState);
    }



    public void setHideArrows(boolean hide) {
        if (getWebView() == null || !(getWebView() instanceof AdvWebView))
            return;

        LinearLayout arrows = (LinearLayout) getView().findViewById(R.id.arrows);
        LinearLayout arrowsShadow = (LinearLayout) getView().findViewById(R.id.arrows_shadow);

        if (arrows == null) return;
        if(hide){
            arrows.setVisibility(View.GONE);
            arrowsShadow.setVisibility(View.GONE);
        }else {
            arrows.setVisibility(View.VISIBLE);
            arrowsShadow.setVisibility(View.VISIBLE);
        }

    }
    public void setHideFab(final FloatingActionButton fab){
        if (getWebView() == null || !(getWebView() instanceof AdvWebView))
            return;
        if(Preferences.isHideFab()) {
            ((AdvWebView) getWebView()).setOnScrollChangedCallback(new AdvWebView.OnScrollChangedCallback() {
                @Override
                public void onScrollDown(Boolean inTouch) {
                    if (!inTouch) return;
                    if (fab.isVisible()) fab.hide();
                }

                @Override
                public void onScrollUp(Boolean inTouch) {
                    if (!inTouch) return;
                    if (!fab.isVisible()) fab.show();


                }

                @Override
                public void onTouch() {
                    fab.show();
                }
            });
        }else {
            ((AdvWebView)getWebView()).setOnScrollChangedCallback(null);
            fab.show();
        }
    }

    public void setHideActionBar() {
        if (getWebView() == null || !(getWebView() instanceof AdvWebView))
            return;
        ActionBar actionBar = getSupportActionBar();
        FloatingActionButton fab = (FloatingActionButton) getView().findViewById(R.id.fab);
        Log.e("sethide", "yes");
        if (actionBar == null) return;
        Log.e("ab", "yes");
        if (fab == null) return;
        Log.e("fb", "yes");
        setHideActionBar((AdvWebView) getWebView(), actionBar, fab);
    }

    public static void setHideActionBar(AdvWebView advWebView, final ActionBar actionBar, final FloatingActionButton fab) {
        final Boolean hideAb = Preferences.isHideActionBar();
        final Boolean hideFab = Preferences.isHideFab();

        if (hideAb|hideFab) {
            advWebView.setOnScrollChangedCallback(new AdvWebView.OnScrollChangedCallback() {
                @Override
                public void onScrollDown(Boolean inTouch) {
                    if (!inTouch)
                        return;
                    if (actionBar.isShowing() & hideAb) {
                        actionBar.hide();
                    }
                    if (fab.isVisible() & hideFab) {
                        fab.hide();
                    }
                }

                @Override
                public void onScrollUp(Boolean inTouch) {
                    if (!inTouch)
                        return;
                    if (!actionBar.isShowing() & hideAb) {
                        actionBar.show();
                    }
                    if (!fab.isVisible() & hideFab) {
                        fab.show();
                    }

                }

                @Override
                public void onTouch() {
                    actionBar.show();
                    fab.show();
                }
            });
        } else {
            advWebView.setOnScrollChangedCallback(null);
            actionBar.show();
            fab.show();
        }
    }


    protected void setWebViewSettings(Boolean loadImagesAutomaticallyAlways) {
        getWebViewExternals().setWebViewSettings(loadImagesAutomaticallyAlways);

    }

    public void setWebViewSettings() {
        setWebViewSettings(false);
    }

    public void onPrepareOptionsMenu() {
        getWebViewExternals().onPrepareOptionsMenu();
    }

    protected void loadPreferences(SharedPreferences prefs) {
        getWebViewExternals().loadPreferences(prefs);

    }
/*
    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        return getWebViewExternals().dispatchKeyEvent(event);
    }

    public boolean dispatchSuperKeyEvent(KeyEvent event) {
        return super.dispatchKeyEvent(event);
    }
    */

    public void showFontSizeDialog() {
        View v = getActivity().getLayoutInflater().inflate(R.layout.font_size_dialog, null);

        assert v != null;
        final SeekBar seekBar = (SeekBar) v.findViewById(R.id.value_seekbar);
        seekBar.setProgress(Preferences.getFontSize(Prefix()) - 1);
        final TextView textView = (TextView) v.findViewById(R.id.value_textview);
        textView.setText((seekBar.getProgress() + 1) + "");

        seekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int i, boolean b) {
                getWebView().getSettings().setDefaultFontSize(i + 1);
                textView.setText((i + 1) + "");
            }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {

            }

            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {

            }
        });
        new MaterialDialog.Builder(getActivity())
                .title("Размер шрифта")
                .customView(v,true)
                .positiveText("OK")
                .negativeText("Отмена")
                .callback(new MaterialDialog.ButtonCallback() {
                    @Override
                    public void onPositive(MaterialDialog dialog) {
                        Preferences.setFontSize(Prefix(), seekBar.getProgress() + 1);
                    }

                    @Override
                    public void onNegative(MaterialDialog dialog) {
                        getWebView().getSettings().setDefaultFontSize(Preferences.Topic.getFontSize());
                    }
                })
                .show();

    }
    public void showStylesDialog(final SharedPreferences prefs) {
        try {
            final String currentValue = App.getInstance().getCurrentTheme();

            ArrayList<CharSequence> newStyleNames = new ArrayList<CharSequence>();
            final ArrayList<CharSequence> newStyleValues = new ArrayList<CharSequence>();

            PreferencesActivity.getStylesList(getActivity(), newStyleNames, newStyleValues);
            final int[] selected = {newStyleValues.indexOf(currentValue)};
            CharSequence[] styleNames = newStyleNames.toArray(new CharSequence[newStyleNames.size()]);

            new MaterialDialog.Builder(getActivity())
                    .title("Стиль")
                    .cancelable(true)
                    .positiveText("Применить")
                    .items(styleNames)
                    .itemsCallbackSingleChoice(selected[0], new MaterialDialog.ListCallbackSingleChoice() {
                        @Override
                        public boolean onSelection(MaterialDialog dialog, View view, int which, CharSequence text) {
                            if (which == -1) {
                                Toast.makeText(getActivity(), "Выберите стиль", Toast.LENGTH_LONG).show();
                                return false;
                            }
                            selected[0] = which;
                            return true;
                        }
                    })
                    .alwaysCallSingleChoiceCallback()
                    .callback(new MaterialDialog.ButtonCallback() {
                        @Override
                        public void onPositive(MaterialDialog dialog) {
                            SharedPreferences.Editor editor = prefs.edit();
                            editor.putString("appstyle", newStyleValues.get(selected[0]).toString());
                            //editor.putBoolean("theme.BrowserStyle", checkBox.isChecked());
                            editor.apply();
                            //((MainActivity)getActivity()).reload();
                        }
                    })
                    .negativeText("Отмена")
                    .show();
        } catch (Exception ex) {
            AppLog.e(getActivity(), ex);
        }
    }

    @Override
    public String Prefix() {
        return null;
    }

    @Override
    public boolean dispatchSuperKeyEvent(KeyEvent event) {
        return false;
    }

    @Override
    public Window getWindow() {
        return getActivity().getWindow();
    }
    @Override
    public void nextPage() {}

    @Override
    public void prevPage() {}

}