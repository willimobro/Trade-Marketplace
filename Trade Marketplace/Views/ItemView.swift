//
//  ItemView.swift
//  Trade Marketplace
//
//  Created by William larsen on 21/09/22.
//

import SwiftUI

struct ItemView: View {
    @Environment(\.dismiss) var dismiss
    @State  var titleItem: String = ""
    @State  var subtitleItem: String = ""
    @State  var quotesentItem: Int = 0
    @State  var locationItem: String = ""
    @State  var descriptionItem: String = ""
    @State  var imageItem: String = ""
    
    var body: some View {
            ZStack{
                VStack{
                    // BACKEND scrolling image effect + hello
                    Image(imageItem)
                        .resizable()
                        .ignoresSafeArea()
                        .scaledToFit()
                        .overlay(
                            Button {
                                dismiss()
                            } label:    {
                                Image(systemName: "chevron.left")
                                    .resizable()
                                    .frame(width: 19, height: 31)
                                    .foregroundColor(.white)
                                    .shadow(color: .black, radius: 4, x: 0, y: 0)
                            }   .frame(maxWidth: .infinity, maxHeight:.infinity, alignment: .topLeading)
                                .padding(.horizontal, 30)
                                .padding(.vertical, 30)
                        )
                    Spacer()
                }
                .ignoresSafeArea()
                .navigationBarBackButtonHidden(true)
                .navigationBarTitleDisplayMode(.inline)
                .navigationBarHidden(true)
                ContentItem(title: $titleItem, subtitle: $subtitleItem, quotesent: $quotesentItem, location: $locationItem, description: $descriptionItem)
                // text needs to expand content item frame when scrolled
            }
        
    }
}
